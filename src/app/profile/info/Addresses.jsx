"use client";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const Addresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Uy manzili",
      address: "Toshkent, Yunusobod tumani, Buyuk ipak yo'li 123",
      phone: "+998901234567",
      default: true,
    },
    {
      id: 2,
      name: "Ish joyi",
      address: "Toshkent, Mirobod tumani, Amir Temur ko'chasi 45-uy",
      phone: "+998901234567",
      default: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    phone: "",
    default: false,
  });

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.phone) {
      return;
    }
    const newId = addresses.length + 1;
    if (newAddress.default) {
      setAddresses([
        ...addresses.map((addr) => ({ ...addr, default: false })),
        { ...newAddress, id: newId },
      ]);
    } else {
      setAddresses([...addresses, { ...newAddress, id: newId }]);
    }
    setIsAdding(false);
    setNewAddress({ name: "", address: "", phone: "", default: false });
  };

  const handleEditAddress = (address) => {
    setIsEditing(address.id);
    setNewAddress({ ...address });
  };

  const handleSaveEdit = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.phone) {
      return;
    }
    setAddresses(
      addresses.map((addr) =>
        addr.id === isEditing
          ? {
              ...newAddress,
              id: isEditing,
              default: newAddress.default ? true : addr.default,
            }
          : { ...addr, default: newAddress.default ? false : addr.default }
      )
    );
    setIsEditing(null);
    setNewAddress({ name: "", address: "", phone: "", default: false });
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id
          ? { ...addr, default: true }
          : { ...addr, default: false }
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mening manzillarim</CardTitle>
          <Button onClick={() => setIsAdding(true)} className="cursor-pointer bg-[#1862D9] hover:bg-[#1862D9]">
            Manzil qo'shish
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(isAdding || isEditing) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">
              {isEditing ? "Manzil tahrirlash" : "Yangi manzil qo'shish"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  htmlFor="address-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manzil nomi
                </Label>
                <Input
                  id="address-name"
                  type="text"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                  placeholder="Uy, ish joyi va h.k."
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manzil
                </Label>
                <Textarea
                  id="address"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  placeholder="Ko'cha, uy raqami va boshqalar"
                  className="w-full"
                  rows={3}
                />
              </div>
              <div>
                <Label
                  htmlFor="address-phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefon raqami
                </Label>
                <Input
                  id="address-phone"
                  type="text"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  placeholder="+998901234567"
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="default-address"
                  checked={newAddress.default}
                  onCheckedChange={(checked) =>
                    setNewAddress({ ...newAddress, default: checked })
                  }
                />
                <Label
                  htmlFor="default-address"
                  className="text-sm text-gray-700"
                >
                  Standart manzil sifatida belgilash
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                  setNewAddress({
                    name: "",
                    address: "",
                    phone: "",
                    default: false,
                  });
                }}
                className="cursor-pointer hover:bg-[#1862D9] hover:text-white"
              >
                Bekor qilish
              </Button>
              <Button
                onClick={isEditing ? handleSaveEdit : handleAddAddress}
                className="cursor-pointer bg-[#1862D9] hover:bg-[#1862D9]"
              >
                Saqlash
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      {address.name}
                    </h3>
                    {address.default && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Standart
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.address}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Telefon: {address.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              {!address.default && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-3 cursor-pointer text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Standart manzil sifatida belgilash
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Addresses;
