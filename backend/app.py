from flask import Flask, request
from flask_cors import CORS
from database import db

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://root:%24ATLzz3311%24@localhost/NorthStarGames"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/")
def home():
    return {
        "message": "NorthStar backend is connected!",
        "created_by": "Jesse Sherk"
    }


@app.route("/test-db")
def test_db():
    result = db.session.execute(db.text("SHOW TABLES;"))
    tables = [row[0] for row in result]
    return {"tables": tables}


@app.route("/cards", methods=["GET"])
def get_cards():
    result = db.session.execute(db.text("SELECT * FROM CARD;"))
    cards = []

    for row in result:
        cards.append(dict(row._mapping))

    return {"cards": cards}


@app.route("/cards", methods=["POST"])
def add_card():
    # M8.4 GUI Database App created by Jesse Sherk

    data = request.get_json()

    card_name = data.get("CardName")
    card_type = data.get("CardType")
    color_identity = data.get("ColorIdentity")
    quantity_owned = data.get("QuantityOwned")
    quantity_available = data.get("QuantityAvailable")
    market_value = data.get("MarketValue")

    sql = db.text("""
        INSERT INTO CARD
        (CardName, CardType, ColorIdentity, QuantityOwned, QuantityAvailable, MarketValue)
        VALUES
        (:card_name, :card_type, :color_identity, :quantity_owned, :quantity_available, :market_value)
    """)

    db.session.execute(sql, {
        "card_name": card_name,
        "card_type": card_type,
        "color_identity": color_identity,
        "quantity_owned": quantity_owned,
        "quantity_available": quantity_available,
        "market_value": market_value
    })

    db.session.commit()

    return {
        "message": "Card added successfully by Jesse Sherk!",
        "card_added": card_name
    }


if __name__ == "__main__":
    app.run(debug=True, port=5001)