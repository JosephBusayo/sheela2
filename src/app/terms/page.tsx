import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, AlertCircle, Package, CreditCard, Truck } from "lucide-react"
import Footer from '@/components/Footer'
import Link from "next/link"
import Header from "@/components/Header"

export default function Terms() {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            <PageHeader
                title="Returns Policy"
                description="At Sheela, every item is made with intention and tailored to your fit. Learn about our returns, exchanges, and alteration policies."
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Introduction */}
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-card-foreground leading-relaxed text-lg">
                                Because our pieces are custom-made, we do not accept returns for a refund. However, we're happy to
                                assist with alterations, store credit, or exchanges under the conditions below.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Return Eligibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <RotateCcw className="h-6 w-6 text-accent" />
                                Return Eligibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        Items must be returned within <strong>14 business days</strong> of delivery.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        The item must be unworn, unwashed, and unaltered, and free from stains, perfumes, or damage.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Items must be returned with all original tags and packaging.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>All made-to-fit orders are non-refundable, but eligible for store credit or adjustments.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Alterations & Exchanges */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Package className="h-6 w-6 text-accent" />
                                Alterations & Exchanges
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        If your item does not fit as expected, we're happy to alter it or remake based on your original
                                        measurement submission. You must notify us via our return form within{" "}
                                        <strong>7 business days</strong>.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        Alterations are <strong>free for the first request</strong>. Subsequent changes may incur a fee.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>
                                        You can also request an exchange for a different size or colour in the same style (if applicable).
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* How to Start a Return */}
                    <Card>
                        <CardHeader>
                            <CardTitle>How to Start a Return or Exchange</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ol className="space-y-4 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        1
                                    </span>
                                    <span>Complete the online return form.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        2
                                    </span>
                                    <span>Our team will review your request within 2 business days and contact you with next steps.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        3
                                    </span>
                                    <span>You'll be responsible for return shipping unless the error is from our end.</span>
                                </li>
                            </ol>

                            <div className="pt-4">
                                <Button asChild className="bg-accent hover:bg-accent/90">
                                    <Link href="/return-item">Start Return Request</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Non-Returnable Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                                Non-Returnable Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                                    <span>All made-to-measure or custom-fit items.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Items returned without tags, in used or damaged condition.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Lingerie, underwear, or intimate wear.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Items returned after 14 business days.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Sale Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <CreditCard className="h-6 w-6 text-accent" />
                                Sale Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-card-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Items bought on sale are final and not eligible for exchange or return unless faulty.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                    <span>If eligible, only store credit will be issued.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Lost Packages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Truck className="h-6 w-6 text-accent" />
                                Lost Packages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-card-foreground leading-relaxed">
                                If your package is lost in transit and proof of delivery has not been obtained, we will ship a
                                replacement or issue a refund. Once delivery is confirmed, we are no longer liable.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer/>
        </div>
    )
}
