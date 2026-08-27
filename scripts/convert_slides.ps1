param(
    [Parameter(Mandatory = $true)]
    [string]$RepositoryRoot,

    [switch]$Force
)

$ErrorActionPreference = "Stop"
$failed = @()
$presentations = Get-ChildItem -LiteralPath $RepositoryRoot -Recurse -File -Filter "*.pptx" |
    Sort-Object FullName

foreach ($source in $presentations) {
    $target = [System.IO.Path]::ChangeExtension($source.FullName, ".pdf")
    if ((Test-Path -LiteralPath $target) -and -not $Force) {
        Write-Output "Skipping existing PDF: $target"
        continue
    }

    Write-Output "Converting: $($source.FullName)"
    $powerPoint = $null
    $presentation = $null

    try {
        $powerPoint = New-Object -ComObject PowerPoint.Application
        $powerPoint.DisplayAlerts = 1
        $presentation = $powerPoint.Presentations.Open(
            $source.FullName,
            $true,
            $false,
            $false
        )
        $presentation.SaveAs($target, 32)
    }
    catch {
        $failed += $source.FullName
        Write-Warning "Conversion failed: $($source.FullName) - $($_.Exception.Message)"
    }
    finally {
        if ($null -ne $presentation) {
            try { $presentation.Close() } catch {}
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
        }
        if ($null -ne $powerPoint) {
            try { $powerPoint.Quit() } catch {}
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
        }
        [GC]::Collect()
        [GC]::WaitForPendingFinalizers()
        [System.Threading.Thread]::Sleep(300)
    }
}

if ($failed.Count -gt 0) {
    Write-Error "$($failed.Count) conversion(s) failed."
    exit 1
}
