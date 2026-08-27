const papers = [
    {
        title: "Renormalization Group Flow as Optimal Transport",
        date: "2026-06-21",
        topic: "Statistical physics",
        note: "Exact renormalization-group dynamics through the geometry of optimal transport.",
        arxiv: "https://arxiv.org/abs/2202.11737",
        slides: "Renormalization Group Flow as Optimal Transport/文献分享_20260621_Renormalization Group Flow asOptimal Transport.pdf",
    },
    {
        title: "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels",
        date: "2026-04-03",
        topic: "Machine learning",
        note: "A compact world model trained stably from pixels with a two-term objective.",
        arxiv: "https://arxiv.org/abs/2603.19312",
        slides: "LeWorldModel Stable End-to-End Joint-Embedding Predictive Architecture from Pixels/文献汇报_20260403_leaworldmodel.pdf",
    },
    {
        title: "Generative Diffusion Model with Inverse Renormalization Group Flows",
        date: "2025-12-23",
        topic: "Machine learning",
        note: "A coarse-to-fine generative route inspired by reversing renormalization-group flows.",
        arxiv: "https://arxiv.org/abs/2501.09064",
        slides: "Generative Diffusion Model with Inverse Renormalization Group Flows/文献汇报_20251223_Generative diffusion model with inverse renormalization group flows.pdf",
    },
    {
        title: "Kardar–Parisi–Zhang Scaling in Time-Crystalline Matter",
        date: "2025-10-18",
        topic: "Statistical physics",
        note: "KPZ universality emerging from the Goldstone mode of broken time-translation symmetry.",
        arxiv: "https://arxiv.org/abs/2412.09677",
        slides: "Kardar-Parisi-Zhang Scaling in Time-Crystalline Matter/文献分享_20251018_Kardar-Parisi-Zhang Scaling in Time-Crystalline Matter.pdf",
    },
    {
        title: "Kinetic Theory of Decentralized Learning for Smart Active Matter",
        date: "2025-07-28",
        topic: "Physics + AI",
        note: "A kinetic framework for agents that exchange policies and learn collective target states.",
        arxiv: "https://arxiv.org/abs/2501.03948",
        slides: "Kinetic Theory of Decentralized Learning for Smart Active Matter/文献分享_20250728_Kinetic Theory of Decentralized Learning for Smart Active Matter.pdf",
    },
    {
        title: "The Inconvenient Truth About Flocks",
        date: "2025-05-24",
        topic: "Active matter",
        note: "A careful reanalysis of scaling claims in two-dimensional polar active fluids.",
        arxiv: "https://arxiv.org/abs/2503.17064",
        slides: "The Inconvenient Truth About Flocks/文献分享_20250524_inconvenient truth about flocks.pdf",
    },
    {
        title: "Giant Density Fluctuations in Locally Hyperuniform States",
        date: "2025-02-16",
        topic: "Active matter",
        note: "How enhanced large-scale fluctuations coexist with local hyperuniformity.",
        arxiv: "https://arxiv.org/abs/2410.18741",
        slides: "Giant Density Fluctuations in Locally Hyperuniform States/文献分享_20250216_giant density fluctuations in locally hyperuniform.pdf",
    },
    {
        title: "Active-Hydraulic Flows Solve the 6-Vertex Model (and Vice Versa)",
        date: "2024-11-24",
        topic: "Active matter",
        note: "Confined active flows reveal a quantitative bridge to the six-vertex model.",
        arxiv: "https://arxiv.org/abs/2410.13377",
        slides: "Active-Hydraulic Flows Solve the 6-Vertex Model (and Vice Versa)/文献分享_20241124_active hydrauli flows solve the 60vertex models(and vice versa).pdf",
    },
    {
        title: "Topology-Driven Ordering of Flocking Matter",
        date: "2024-08-31",
        topic: "Active matter",
        note: "Topological defects, domain walls, and the route toward long-range polar order.",
        arxiv: "https://arxiv.org/abs/2103.03861",
        slides: "Topology-Driven Ordering of Flocking Matter/文献汇报_20240831_Topology-Driven Ordering of Flocking Matter.pdf",
    },
    {
        title: "An Introduction to Motility-Induced Phase Separation",
        date: "2024-06-07",
        topic: "Active matter",
        note: "A guided introduction to phase separation driven by persistent self-propulsion.",
        arxiv: "https://arxiv.org/abs/2112.03979",
        slides: "An Introduction to Motility-Induced Phase Separation/文献分享_20240607_An Introduction to MIPS.pdf",
    },
    {
        title: "The Physics of the Vicsek Model",
        date: "2024-01-06",
        topic: "Active matter",
        note: "Lecture notes on the canonical model of collective motion and its universality class.",
        arxiv: "https://arxiv.org/abs/1511.01451",
        slides: "The Physics of the Vicsek Model/文献分享_20240106_the physics of vicsek model.pdf",
    },
];

const state = {
    query: "",
    topic: "All",
};

const paperGrid = document.querySelector("#paper-grid");
const paperTemplate = document.querySelector("#paper-card-template");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const topicFilters = document.querySelector("#topic-filters");

function formatDate(value) {
    return value.replaceAll("-", ".");
}

function renderFilters() {
    const topics = ["All", ...new Set(papers.map((paper) => paper.topic))];
    const fragment = document.createDocumentFragment();

    topics.forEach((topic) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-button";
        button.textContent = topic === "All" ? "全部" : topic;
        button.setAttribute("aria-pressed", String(topic === state.topic));
        button.addEventListener("click", () => {
            state.topic = topic;
            renderFilters();
            renderPapers();
        });
        fragment.append(button);
    });

    topicFilters.replaceChildren(fragment);
}

function renderPapers() {
    const query = state.query.trim().toLowerCase();
    const visiblePapers = papers.filter((paper) => {
        const matchesTopic = state.topic === "All" || paper.topic === state.topic;
        const haystack = `${paper.title} ${paper.topic} ${paper.note}`.toLowerCase();
        return matchesTopic && haystack.includes(query);
    });

    const fragment = document.createDocumentFragment();

    visiblePapers.forEach((paper) => {
        const card = paperTemplate.content.firstElementChild.cloneNode(true);
        card.querySelector(".card-date").textContent = formatDate(paper.date);
        card.querySelector(".card-topic").textContent = paper.topic;
        card.querySelector(".card-title").textContent = paper.title;
        card.querySelector(".card-note").textContent = paper.note;
        card.querySelector(".arxiv-link").href = paper.arxiv;
        card.querySelector(".slides-link").href = encodeURI(paper.slides);
        fragment.append(card);
    });

    paperGrid.replaceChildren(fragment);
    resultCount.textContent = `${visiblePapers.length} / ${papers.length} 篇`;
    emptyState.hidden = visiblePapers.length !== 0;
    paperGrid.hidden = visiblePapers.length === 0;
}

searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderPapers();
});

document.querySelector("#paper-count").textContent = papers.length;
renderFilters();
renderPapers();
