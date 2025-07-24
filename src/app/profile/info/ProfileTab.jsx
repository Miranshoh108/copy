"use client";
import { CreditCard, Edit, Gift, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ProfileTab = ({ user, isEditing, setIsEditing, setUser }) => {
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate inputs (basic example)
    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }
    // Update parent user state
    setUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user); // Reset to original user data
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.totalOrders}
                </p>
                <p className="text-gray-500 text-sm">Jami buyurtmalar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.totalSpent}
                </p>
                <p className="text-gray-500 text-sm">Jami xarajat (so'm)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            <Button
              variant="default"
              onClick={() => setIsEditing(!isEditing)}
              className="cursor-pointer flex items-center bg-[#1862D9] hover:bg-[#1862D9] gap-2"
            >
              {!isEditing && <Edit size={16} />}{" "}
              {isEditing ? "Bekor qilish" : "Tahrirlash"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                To'liq ismi
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Telefon raqami
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email manzili
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="memberSince"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                A'zo bo'lgan sana
              </Label>
              <Input
                id="memberSince"
                type="text"
                value={`${user.memberSince} yil`}
                disabled
                className="w-full bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                className="cursor-pointer font-medium bg-[#1862D9]"
              >
                Saqlash
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="cursor-pointer font-medium bg-gray-300"
              >
                Bekor qilish
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
