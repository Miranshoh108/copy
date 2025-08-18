"use client";
import { CreditCard, Edit, Gift, ShoppingBag } from "lucide-react";
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

const ProfileTab = ({
  user,
  isEditing,
  setIsEditing,
  setUser,
  updateUserProfile,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    age: user.age || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validate inputs
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setError("Ism, familiya va telefon raqami to'ldirilishi shart");
      return;
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email manzili noto'g'ri formatda");
      return;
    }

    // Phone validation
    if (!/^\+998\d{9}$/.test(formData.phone)) {
      setError("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // API orqali ma'lumotlarni yangilash
      await updateUserProfile(formData);

      // Local state'ni yangilash
      setUser((prev) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        age: formData.age,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Profile yangilashda xatolik:", error);
      setError(error.message || "Profile yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      age: user.age || "",
    });
    setIsEditing(false);
    setError(null);
  };

  const handleEdit = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      age: user.age || "",
    });
    setIsEditing(true);
    setError(null);
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
              <div className="w-12 h-12 bg-green-100 text-[#249B73] rounded-lg flex items-center justify-center">
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

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-[#249B73] rounded-lg flex items-center justify-center">
                <Gift size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.loyaltyPoints}
                </p>
                <p className="text-gray-500 text-sm">Bonus balllar</p>
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
              onClick={isEditing ? handleCancel : handleEdit}
              className="cursor-pointer flex items-center bg-[#249B73] hover:bg-[#1e8a66] gap-2"
              disabled={loading}
            >
              {!isEditing && <Edit size={16} />}
              {isEditing ? "Bekor qilish" : "Tahrirlash"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ism
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
                placeholder="Ismingizni kiriting"
              />
            </div>

            <div>
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Familiya
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
                placeholder="Familiyangizni kiriting"
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
                placeholder="+998901234567"
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
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Jins
              </Label>
              {isEditing ? (
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Jinsni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkak</SelectItem>
                    <SelectItem value="female">Ayol</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={
                    formData.gender === "male"
                      ? "Erkak"
                      : formData.gender === "female"
                      ? "Ayol"
                      : ""
                  }
                  disabled
                  className="w-full bg-gray-50"
                />
              )}
            </div>

            <div>
              <Label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Yosh
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
                placeholder="Yoshingizni kiriting"
                min="1"
                max="120"
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
                value={user.memberSince}
                disabled
                className="w-full bg-gray-50"
              />
            </div>

            <div>
              <Label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Foydalanuvchi turi
              </Label>
              <Input
                id="role"
                type="text"
                value={
                  user.role === "admin"
                    ? "Administrator"
                    : user.isWorker
                    ? "Xodim"
                    : "Mijoz"
                }
                disabled
                className="w-full bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="cursor-pointer font-medium bg-[#249B73] hover:bg-[#1e8a66] disabled:opacity-50"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="cursor-pointer font-medium"
              >
                Bekor qilish
              </Button>
            </div>
          )}

          {/* Additional Info */}
          {user.lastLogin && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">So'nggi kirish:</span>{" "}
                  {new Date(user.lastLogin).toLocaleString("uz-UZ")}
                </div>
                {user.lastActivity && (
                  <div>
                    <span className="font-medium">So'nggi faollik:</span>{" "}
                    {new Date(user.lastActivity).toLocaleString("uz-UZ")}
                  </div>
                )}
                {user.telegramId && (
                  <div>
                    <span className="font-medium">Telegram ID:</span>{" "}
                    {user.telegramId}
                  </div>
                )}
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isOnline
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
