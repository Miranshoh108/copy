"use client";
import { CreditCard, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Cards = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      number: "**** **** **** 1234",
      exp: "12/25",
      name: "Aziz Karimov",
      type: "Visa",
    },
    {
      id: 2,
      number: "**** **** **** 5678",
      exp: "06/24",
      name: "Aziz Karimov",
      type: "Uzcard",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [newCard, setNewCard] = useState({
    number: "",
    exp: "",
    name: "",
    type: "Visa",
  });

  const handleAddCard = () => {
    if (!newCard.number || !newCard.exp || !newCard.name) {
      return;
    }
    setCards([...cards, { ...newCard, id: cards.length + 1 }]);
    setIsAdding(false);
    setNewCard({ number: "", exp: "", name: "", type: "Visa" });
  };

  const handleEditCard = (card) => {
    setIsEditing(card.id);
    setNewCard({ ...card });
  };

  const handleSaveEdit = () => {
    if (!newCard.number || !newCard.exp || !newCard.name) {
      return;
    }
    setCards(
      cards.map((card) =>
        card.id === isEditing ? { ...newCard, id: isEditing } : card
      )
    );
    setIsEditing(null);
    setNewCard({ number: "", exp: "", name: "", type: "Visa" });
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mening kartalarim</CardTitle>
          <Button onClick={() => setIsAdding(true)} className="cursor-pointer bg-[#249B73] hover:bg-[#1ba778]">
            Karta qo'shish
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(isAdding || isEditing) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">
              {isEditing ? "Karta tahrirlash" : "Yangi karta qo'shish"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="card-number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Karta raqami
                </Label>
                <Input
                  id="card-number"
                  type="text"
                  value={newCard.number}
                  onChange={(e) =>
                    setNewCard({ ...newCard, number: e.target.value })
                  }
                  placeholder="**** **** **** ***"
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="card-exp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amal qilish muddati
                </Label>
                <Input
                  id="card-exp"
                  type="text"
                  value={newCard.exp}
                  onChange={(e) =>
                    setNewCard({ ...newCard, exp: e.target.value })
                  }
                  placeholder="MM/YY"
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="card-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Karta egasi
                </Label>
                <Input
                  id="card-name"
                  type="text"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard({ ...newCard, name: e.target.value })
                  }
                  placeholder="Ism Familiya"
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="card-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Karta turi
                </Label>
                <Select
                  value={newCard.type}
                  onValueChange={(value) =>
                    setNewCard({ ...newCard, type: value })
                  }
                >
                  <SelectTrigger id="card-type">
                    <SelectValue placeholder="Karta turi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Humo">Humo</SelectItem>
                    <SelectItem value="Uzcard">Uzcard</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setNewCard({ number: "", exp: "", name: "", type: "Visa" });
                }}
                className="cursor-pointer hover:bg-[#249B73] hover:text-white"
              >
                Bekor qilish
              </Button>
              <Button
                onClick={isEditing ? handleSaveEdit : handleAddCard}
                className="cursor-pointer bg-[#249B73] hover:bg-[#249B73]"
              >
                Saqlash
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{card.number}</p>
                  <p className="text-sm text-gray-500">
                    {card.exp} • {card.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCard(card)}
                    className="text-green-600 hover:text-green-800 cursor-pointer"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {card.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Cards;
