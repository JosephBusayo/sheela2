import Header from "@/components/Header"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Globe, Clock, AlertTriangle } from "lucide-react"
import Footer from "@/components/Footer"

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <PageHeader
                title="Shipping Policy"
                description="Learn about our shipping process, delivery times, and policies for both domestic and international orders."
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Processing Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Clock className="h-6 w-6 text-accent" />
                                Processing Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-card-foreground leading-relaxed">
                                All Sheela pieces are carefully produced and dispatched from our studio in Abuja. Please allow{" "}
                                <strong>5–7 business days</strong> for processing before your order is shipped.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Within Nigeria */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Truck className="h-6 w-6 text-accent" />
                                Within Nigeria
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        Delivery takes <strong>2–4 business days</strong> after dispatch.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>A tracking number will be provided once your order is shipped.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>All deliveries are made via trusted logistics partners.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* International Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Globe className="h-6 w-6 text-accent" />
                                International Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        Orders are processed within <strong>5–7 business days</strong>.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        Shipping typically takes an additional <strong>2–4 business days</strong>, depending on your
                                        location.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        Please ensure your shipping address is correctly entered, as we do not deliver to P.O. boxes.
                                    </span>
                                </li>
                            </ul>

                            <div className="bg-muted p-4 rounded-lg border-l-4 border-destructive">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Note:</strong> We are not responsible for any custom clearance fees or delays caused by
                                        customs in your country.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Costs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Costs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-card-foreground leading-relaxed">
                                Shipping fees are calculated at checkout and vary by delivery destination.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tracking & Delivery Issues */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tracking & Delivery Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-card-foreground mb-4">
                                If your parcel hasn't arrived within 10 business days, please:
                            </p>
                            <ol className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        1
                                    </span>
                                    <span>Contact us with your order number.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        2
                                    </span>
                                    <span>Our logistics team will help track your package.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        3
                                    </span>
                                    <span>You may also contact the courier directly using the tracking number provided.</span>
                                </li>
                            </ol>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
