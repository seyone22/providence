"use client";

import { useState } from "react";
import { User, Car, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import Navbar from "@/app/components/Navbar";
import { submitCarRequest } from "@/actions/request-actions"; // Import the Server Action

export default function RequestCar() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", country: "", city: "",
        make: "", vehicle_model: "", yearFrom: "", yearTo: "",
        budget: "", currency: "usd", specs: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            // Call the Server Action directly
            const response = await submitCarRequest(formData);

            if (response.success) {
                setSuccessMsg("Your request has been sent! Our team will contact you shortly.");
                // Reset form
                setFormData({
                    name: "", email: "", phone: "", country: "", city: "",
                    make: "", vehicle_model: "", yearFrom: "", yearTo: "",
                    budget: "", currency: "usd", specs: ""
                });
            } else {
                setErrorMsg(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto text-center mb-12">
                    <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-3">Start Your Journey</p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Request Your Dream Car</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Fill out the form below with your requirements and our team will contact you via WhatsApp to discuss your perfect vehicle.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Your Details Column */}
                        <Card className="shadow-sm border-gray-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                                    <User className="text-gray-400" /> Your Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input id="name" required value={formData.name} onChange={handleChange} placeholder="John Smith" className="bg-gray-50/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bg-gray-50/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+44 7123 456789" className="bg-gray-50/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Country *</Label>
                                    <Select required value={formData.country} onValueChange={(val: any) => handleSelectChange("country", val)}>
                                        <SelectTrigger className="bg-gray-50/50">
                                            <SelectValue placeholder="Select your country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="uae">UAE</SelectItem>
                                            <SelectItem value="sl">Sri Lanka</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input id="city" required value={formData.city} onChange={handleChange} placeholder="London" className="bg-gray-50/50" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Car Details Column */}
                        <Card className="shadow-sm border-gray-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                                    <Car className="text-gray-400" /> Car Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make *</Label>
                                        <Input id="make" required value={formData.make} onChange={handleChange} placeholder="Mercedes-Benz" className="bg-gray-50/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_model">vehicle_model *</Label>
                                        <Input id="vehicle_model" required value={formData.vehicle_model} onChange={handleChange} placeholder="S-Class" className="bg-gray-50/50" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="yearFrom">Year From</Label>
                                        <Input id="yearFrom" type="number" value={formData.yearFrom} onChange={handleChange} placeholder="2020" className="bg-gray-50/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="yearTo">Year To</Label>
                                        <Input id="yearTo" type="number" value={formData.yearTo} onChange={handleChange} placeholder="2024" className="bg-gray-50/50" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-[2fr_1fr] gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget">Maximum Budget *</Label>
                                        <Input id="budget" required value={formData.budget} onChange={handleChange} placeholder="50,000" className="bg-gray-50/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Currency</Label>
                                        <Select value={formData.currency} onValueChange={(val: any) => handleSelectChange("currency", val)}>
                                            <SelectTrigger className="bg-gray-50/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usd">USD</SelectItem>
                                                <SelectItem value="gbp">GBP</SelectItem>
                                                <SelectItem value="eur">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specs">Specifications</Label>
                                    <Textarea id="specs" value={formData.specs} onChange={handleChange} placeholder="Color, mileage, features, etc." className="min-h-[120px] bg-gray-50/50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto px-12 py-6 text-lg bg-[#1a2b4c] hover:bg-[#121f3a] text-white">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting Request...
                                </>
                            ) : (
                                "Submit Vehicle Request"
                            )}
                        </Button>

                        {successMsg && (
                            <p className="text-green-600 font-medium bg-green-50 border border-green-200 px-4 py-2 rounded-md">{successMsg}</p>
                        )}
                        {errorMsg && (
                            <p className="text-red-600 font-medium bg-red-50 border border-red-200 px-4 py-2 rounded-md">{errorMsg}</p>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
}