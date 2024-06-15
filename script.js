const domain = "https://api.deepwoken.co";


async function getBuild(id) {
    const response = await fetch(`${domain}/build?id=${id}`);
    const build = await response.json();

    if (build.status !== "success") return null

    return build.content
}


async function getTalent(name) {
    const response = await fetch(`${domain}/get?type=talent&name=${name}`);
    const build = await response.json();

    if (build.status !== "success") return null

    return build.content
}

async function getAllTalent() {
    const response = await fetch(`${domain}/get?type=talent&name=all`);
    const build = await response.json();

    if (build.status !== "success") return null

    return build.content
}

async function getMantra(name) {
    const response = await fetch(`${domain}/get?type=mantra&name=${name}`);
    const build = await response.json();

    if (build.status !== "success") return null

    return build.content
}

async function getAllMantra() {
    const response = await fetch(`${domain}/get?type=mantra&name=all`);
    const build = await response.json();

    if (build.status !== "success") return null

    return build.content
}

let allTalents;
let allMantras;

let build;
let availableTalents = [];
let takenTalents = [];

getAllTalent().then((value) => {
    allTalents = value;
})

getAllMantra().then((value) => {
    allMantras = value;
})

document.querySelector("#confirm-button").onclick = function () {
    let buildLink = document.querySelector("#build-link").value;
    let index = buildLink.indexOf("id=")
    let buildId = buildLink.substring(index + 3);

    getBuild(buildId).then((value) => {
        build = value;
        availableTalents = getAvailableTalents(build);
        fillTalent();
        talentsChanged();
    });
}


function fillTalent() {
    talentContainers = document.querySelectorAll(".talent-container");
    takenTalents = [];
    for (let i = 0; i < talentContainers.length; i++) {
        talentContainers[i].innerHTML = "";
    }
    // Build talent
    for (let i of build.talents) {
        let talentContainers = document.querySelector("#build-talent .talent-container");
        let talent = allTalents[i.toLowerCase()];
        let categoryId = talent.category.toLowerCase().split(" ").join("-");

        let categoryDiv = document.querySelector(`#build-talent #${categoryId}`);

        if (categoryDiv === null) {
            categoryDiv = document.createElement("div");
            categoryDiv.id = categoryId;
            categoryDiv.classList.add("category");

            let title = document.createElement("h6");
            title.innerText = talent.category
            categoryDiv.appendChild(title);

            talentContainers.appendChild(categoryDiv);
        }

        // <div class="talent rare">your mom</div>
        let talentDiv = document.createElement("div");
        talentDiv.classList.add("talent");
        talentDiv.classList.add(talent.rarity.toLowerCase());
        talentDiv.innerText = i;

        categoryDiv.appendChild(talentDiv);
    }
    for (let i of availableTalents) {
        let talentContainers = document.querySelector("#available-talent .talent-container");
        let talent = allTalents[i.toLowerCase()];
        let categoryId = talent.category.toLowerCase().split(" ").join("-");

        let categoryDiv = document.querySelector(`#available-talent #${categoryId}`);

        if (categoryDiv === null) {
            categoryDiv = document.createElement("div");
            categoryDiv.id = categoryId;
            categoryDiv.classList.add("category");

            let title = document.createElement("h6");
            title.innerText = talent.category
            categoryDiv.appendChild(title);

            talentContainers.appendChild(categoryDiv);
        }

        let talentDiv = document.createElement("div");
        talentDiv.classList.add("talent");
        talentDiv.classList.add(talent.rarity.toLowerCase());
        // talentDiv.id = talent.name.toLowerCase().split(" ").join("-");
        talentDiv.innerText = talent.name;
        talentDiv.onclick = function () {
            if (talentDiv.classList.contains("selected")) {
                removeTalent(talent.name);
            }
            else {
                addTalent(talent.name);
            }
        }

        categoryDiv.appendChild(talentDiv);

    }
}

function talentsChanged() {

    let toGetTalents = arrayDiff(build.talents, takenTalents);
    let toChangeTalents = arrayDiff(takenTalents, build.talents);

    document.querySelector("#to-get-talent .talent-container").innerHTML = "";
    document.querySelector("#to-change-talent .talent-container").innerHTML = "";

    for (let i of toGetTalents) {
        let talentContainers = document.querySelector("#to-get-talent .talent-container");
        let talent = allTalents[i.toLowerCase()];
        if (talent.rarity == "Oath" || talent.rarity == "Quest") continue;
        let categoryId = talent.category.toLowerCase().split(" ").join("-");

        let categoryDiv = document.querySelector(`#to-get-talent #${categoryId}`);

        if (categoryDiv === null) {
            categoryDiv = document.createElement("div");
            categoryDiv.id = categoryId;
            categoryDiv.classList.add("category");

            let title = document.createElement("h6");
            title.innerText = talent.category
            categoryDiv.appendChild(title);

            talentContainers.appendChild(categoryDiv);
        }

        let talentDiv = document.createElement("div");
        talentDiv.classList.add("talent");
        talentDiv.classList.add(talent.rarity.toLowerCase());
        talentDiv.innerText = talent.name;

        categoryDiv.appendChild(talentDiv);

    }

    for (let i of toChangeTalents) {
        let talentContainers = document.querySelector("#to-change-talent .talent-container");
        let talent = allTalents[i.toLowerCase()];
        if (talent.rarity == "Oath" || talent.rarity == "Quest") continue;

        let categoryId = talent.category.toLowerCase().split(" ").join("-");

        let categoryDiv = document.querySelector(`#to-change-talent #${categoryId}`);

        if (categoryDiv === null) {
            categoryDiv = document.createElement("div");
            categoryDiv.id = categoryId;
            categoryDiv.classList.add("category");

            let title = document.createElement("h6");
            title.innerText = talent.category
            categoryDiv.appendChild(title);

            talentContainers.appendChild(categoryDiv);
        }

        let talentDiv = document.createElement("div");
        talentDiv.classList.add("talent");
        talentDiv.classList.add(talent.rarity.toLowerCase());
        talentDiv.innerText = talent.name;

        categoryDiv.appendChild(talentDiv);

    }
}

function addTalent(talentName) {
    takenTalents.push(talentName);

    for (var talentDiv of document.querySelectorAll(`#available-talent .talent-container .talent`)) {
        if (talentDiv.innerHTML === talentName) {
            talentDiv.classList.add("selected");
        }
    }

    // let talentDiv = document.querySelector(`#available-talent .talent-container #${talentName.toLowerCase().split(" ").join("-")}`);
    // talentDiv.classList.add("selected");

    talentsChanged();
}

function removeTalent(talentName) {
    const index = takenTalents.indexOf(talentName);
    if (index > -1) { // only splice array when item is found
        takenTalents.splice(index, 1); // 2nd parameter means remove one item only
    }

    for (var talentDiv of document.querySelectorAll(`#available-talent .talent-container .talent`)) {
        if (talentDiv.innerHTML === talentName) {
            talentDiv.classList.remove("selected");
        }
    }

    // let talentDiv = document.querySelector(`#available-talent .talent-container #${talentName.toLowerCase().split(" ").join("-")}`);
    // talentDiv.classList.remove("selected");

    talentsChanged();
}

function arrayDiff(arrayA, arrayB) { //Array a have but array b don't
    return arrayA.filter(item => !arrayB.includes(item));
}

function checkRequirements(playerStats, cardRequirement) {
    // Function to check if a requirement is met by the player's stats
    function meetsRequirement(playerAttributes, requirements) {
        for (let category in requirements) {
            for (let attribute in requirements[category]) {
                if (playerAttributes[category][attribute] < requirements[category][attribute]) {
                    return false; // Requirement not met
                }
            }
        }
        return true; // All requirements met
    }

    // Check pre-shrine and post-shrine stats
    return {
        preShrine: meetsRequirement(playerStats.preShrine, cardRequirement),
        postShrine: meetsRequirement(playerStats.postShrine, cardRequirement)
    };
}

function getAvailableTalents(build) {
    let attributes = {
        "preShrine": build.preShrine,
        "postShrine": build.attributes
    };

    // console.log(build.stats.meta.Oath);

    let talents = [];


    // console.log(attributes)
    for (const talent in allTalents) {
        talentStatReq = {
            "attunement": allTalents[talent].reqs.attunement,
            "base": allTalents[talent].reqs.base,
            "weapon": allTalents[talent].reqs.weapon
        };

        if (checkRequirements(attributes, talentStatReq).preShrine || checkRequirements(attributes, talentStatReq).postShrine) {
            if (allTalents[talent].rarity === "Advanced" || allTalents[talent].rarity === "Rare" || allTalents[talent].rarity === "Common" || allTalents[talent].rarity === "Quest" || allTalents[talent].rarity === "Oath") {
                if (allTalents[talent].rarity === "Oath" && !allTalents[talent].category.includes(build.stats.meta.Oath)) {
                    continue
                }
                talents.push(talent);
            }
        }
    }

    return talents;
}

document.querySelector("#copy").onclick = function (){
    let toChangeContainers = document.querySelector("#to-change-talent .talent-container").children;
    let toGetContainers = document.querySelector("#to-get-talent .talent-container").children;

    let copyText = ` --- To change talents --- \n`;

    for (let i of toChangeContainers){
        let category = i.querySelector("h6").innerText;
        copyText += `${category}:\n`;
        for (let ii of i.querySelectorAll(".talent")){
            copyText += `+ ${ii.innerText}\n`;
        }
    }

    copyText += ` --- To get talents --- \n`;

    for (let i of toGetContainers){
        let category = i.querySelector("h6").innerText;
        copyText += `${category}:\n`;
        for (let ii of i.querySelectorAll(".talent")){
            copyText += `+ ${ii.innerText}\n`;
        }
    }

    console.log(copyText);
}