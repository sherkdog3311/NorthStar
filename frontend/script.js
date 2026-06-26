// Inventory loads automatically when the page opens.
const searchInput = document.getElementById("searchInput");
const totalCards = document.getElementById("totalCards");
const totalValue = document.getElementById("totalValue");

let allCards = [];

const addCardForm = document.getElementById("addCardForm");

addCardForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newCard = {
        CardName: document.getElementById("cardName").value,
        CardType: document.getElementById("cardType").value,
        ColorIdentity: document.getElementById("colorIdentity").value,
        QuantityOwned: parseInt(document.getElementById("quantityOwned").value),
        QuantityAvailable: parseInt(document.getElementById("quantityAvailable").value),
        MarketValue: parseFloat(document.getElementById("marketValue").value)
    };

    fetch("http://127.0.0.1:5001/cards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCard)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        addCardForm.reset();
        loadInventory();
    });
});

function loadInventory() {
    document.getElementById("message").innerHTML = "Loading inventory...";

    fetch("http://127.0.0.1:5001/cards")
        .then(response => response.json())
        .then(data => {
            allCards = data.cards;
            displayCards(allCards);
            updateStats(allCards);

            document.getElementById("message").innerHTML =
                `Showing ${data.cards.length} cards.`;
        });
}

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const filteredCards = allCards.filter(card =>
        card.CardName.toLowerCase().includes(searchText) ||
        card.CardType.toLowerCase().includes(searchText) ||
        card.ColorIdentity.toLowerCase().includes(searchText)
    );

    displayCards(filteredCards);
    updateStats(filteredCards);

    if (searchText === "") {
        document.getElementById("message").innerHTML =
            `Showing ${allCards.length} cards.`;
    } else {
        document.getElementById("message").innerHTML =
            `Showing ${filteredCards.length} of ${allCards.length} cards.`;
    }
});

function updateStats(cards) {
    const value = cards.reduce((sum, card) => {
        return sum + (parseFloat(card.MarketValue || 0) * parseInt(card.QuantityOwned || 0));
    }, 0);

    totalCards.innerHTML = `${cards.length} Cards`;
    totalValue.innerHTML = `Estimated Collection Value: $${value.toFixed(2)}`;
}

function getColorBadge(color) {
    if (!color) return "⚪ Colorless";

    const lowerColor = color.toLowerCase();

    if (
        lowerColor.includes("green") && lowerColor.includes("blue") ||
        lowerColor.includes("red") && lowerColor.includes("green") ||
        lowerColor.includes("black") && lowerColor.includes("green")
    ) {
        return "🌈 " + color;
    }

    if (lowerColor.includes("green")) return "🟢 " + color;
    if (lowerColor.includes("blue")) return "🔵 " + color;
    if (lowerColor.includes("white")) return "⚪ " + color;
    if (lowerColor.includes("black")) return "⚫ " + color;
    if (lowerColor.includes("red")) return "🔴 " + color;

    return "⚪ " + color;
}

function displayCards(cards) {
    const cardList = document.getElementById("cardList");

    cardList.innerHTML = `
        <table>
            <tr>
                <th>Card Name</th>
                <th>Type</th>
                <th>Color</th>
                <th>Owned</th>
                <th>Available</th>
                <th>Market Value</th>
            </tr>
        </table>
    `;

    const table = cardList.querySelector("table");

    cards.forEach(card => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${card.CardName}</td>
            <td>${card.CardType}</td>
            <td>${getColorBadge(card.ColorIdentity)}</td>
            <td>${card.QuantityOwned}</td>
            <td>${card.QuantityAvailable}</td>
            <td>$${card.MarketValue}</td>
        `;

        table.appendChild(row);
    });
}

// Automatically loads the inventory when the page opens
loadInventory();