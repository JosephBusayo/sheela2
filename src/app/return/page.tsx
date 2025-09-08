"use client"

import type React from "react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { FileText, Upload } from "lucide-react"

export default function Return() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        orderNumber: "",
        items: "",
        reasons: [] as string[],
        otherReason: "",
        customSized: "",
        preferredResolution: "",
        otherResolution: "",
        additionalNotes: "",
        photoAttachment: false,
    })

    const handleReasonChange = (reason: string, checked: boolean) => {
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                reasons: [...prev.reasons, reason],
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                reasons: prev.reasons.filter((r) => r !== reason),
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log("Form submitted:", formData)
        alert("Return request submitted successfully! We'll get back to you within 2 business days.")
    }

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Return / Exchange Form"
                description="Thank you for shopping with Sheela. If you would like to request a return, alteration, or exchange, kindly complete this form and email it to returns@shopsheela.com."
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <FileText className="h-6 w-6 text-accent" />
                                Return Request Form
                            </CardTitle>
                            <p className="text-muted-foreground">A member of our team will get back to you within 2 business days.</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">1. Full Name:</Label>
                                        <Input
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">2. Email Address:</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">3. Phone Number:</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="orderNumber">4. Order Number:</Label>
                                        <Input
                                            id="orderNumber"
                                            value={formData.orderNumber}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, orderNumber: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Items to Return */}
                                <div className="space-y-2">
                                    <Label htmlFor="items">5. Item(s) You Want to Return or Exchange:</Label>
                                    <Textarea
                                        id="items"
                                        value={formData.items}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, items: e.target.value }))}
                                        placeholder="Please describe the item(s) you wish to return or exchange"
                                        required
                                    />
                                </div>

                                {/* Reason for Return */}
                                <div className="space-y-4">
                                    <Label>6. Reason for Return or Exchange (tick one):</Label>
                                    <div className="space-y-3">
                                        {[
                                            "Received wrong item",
                                            "Item does not fit (alteration request)",
                                            "Item arrived damaged",
                                            "I want to exchange for a different size",
                                            "I want to exchange for a different colour",
                                        ].map((reason) => (
                                            <div key={reason} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={reason}
                                                    checked={formData.reasons.includes(reason)}
                                                    onCheckedChange={(checked) => handleReasonChange(reason, checked as boolean)}
                                                />
                                                <Label htmlFor={reason} className="text-sm font-normal">
                                                    {reason}
                                                </Label>
                                            </div>
                                        ))}

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="other"
                                                checked={formData.reasons.includes("other")}
                                                onCheckedChange={(checked) => handleReasonChange("other", checked as boolean)}
                                            />
                                            <Label htmlFor="other" className="text-sm font-normal">
                                                Other (please explain below):
                                            </Label>
                                        </div>

                                        {formData.reasons.includes("other") && (
                                            <Textarea
                                                value={formData.otherReason}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, otherReason: e.target.value }))}
                                                placeholder="Please explain your reason"
                                                className="mt-2"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Custom Sized */}
                                <div className="space-y-3">
                                    <Label>7. Was the item custom-sized (made to fit)?</Label>
                                    <RadioGroup
                                        value={formData.customSized}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, customSized: value }))}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="custom-yes" />
                                            <Label htmlFor="custom-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="custom-no" />
                                            <Label htmlFor="custom-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Preferred Resolution */}
                                <div className="space-y-3">
                                    <Label>8. Preferred Resolution (tick one):</Label>
                                    <RadioGroup
                                        value={formData.preferredResolution}
                                        onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredResolution: value }))}
                                    >
                                        {["Alter item to my measurements", "Exchange for different size/colour", "Store credit"].map(
                                            (resolution) => (
                                                <div key={resolution} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={resolution} id={resolution} />
                                                    <Label htmlFor={resolution}>{resolution}</Label>
                                                </div>
                                            ),
                                        )}

                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="other-resolution" id="other-resolution" />
                                            <Label htmlFor="other-resolution">Other:</Label>
                                        </div>
                                    </RadioGroup>

                                    {formData.preferredResolution === "other-resolution" && (
                                        <Input
                                            value={formData.otherResolution}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, otherResolution: e.target.value }))}
                                            placeholder="Please specify"
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                {/* Photo Upload */}
                                <div className="space-y-3">
                                    <Label>9. Upload a Photo of the Item (optional):</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="photo"
                                            checked={formData.photoAttachment}
                                            onCheckedChange={(checked) =>
                                                setFormData((prev) => ({ ...prev, photoAttachment: checked as boolean }))
                                            }
                                        />
                                        <Label htmlFor="photo" className="flex items-center gap-2">
                                            <Upload className="h-4 w-4" />
                                            Attach in email
                                        </Label>
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">10. Additional Notes:</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.additionalNotes}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                                        placeholder="Any additional information you'd like to share"
                                    />
                                </div>

                                {/* Important Notice */}
                                <div className="bg-muted p-4 rounded-lg border-l-4 border-accent">
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Important:</strong> Submit this form within 14 business days of receiving your order. Email
                                        to: <strong>returns@shopsheela.com</strong>
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                                    Submit Return Request
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
