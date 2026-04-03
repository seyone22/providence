"use server";

import React from "react";
import {Document, Image, Page, renderToStream, StyleSheet, Text, View} from "@react-pdf/renderer";
import connectToDatabase from "@/lib/mongoose";
import SpecDossier from "@/models/SpecDossier";

// --- PDF STYLES ---
const styles = StyleSheet.create({
    page: {padding: 0, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica'},

    // Cover
    coverPage: {height: '100%', backgroundColor: '#09090b', color: '#FFFFFF', padding: 60, justifyContent: 'center'},
    accentBar: {width: 60, height: 4, backgroundColor: '#ffffff', marginBottom: 30},
    title: {fontSize: 42, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Helvetica-Bold'},
    subtitle: {fontSize: 18, color: '#a1a1aa'},
    coverFooter: {position: 'absolute', bottom: 60, left: 60},

    // Content Pages
    section: {padding: '40 50'},
    headerBox: {borderBottom: '2pt solid #000000', paddingBottom: 15, marginBottom: 20},
    headerText: {fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#000000', textTransform: 'uppercase'},

    // Grid & Rows
    row: {flexDirection: 'row', borderBottom: '1pt solid #f4f4f5', paddingVertical: 10, alignItems: 'center'},
    colLabel: {flex: 1, fontSize: 10, color: '#71717a', textTransform: 'uppercase', fontFamily: 'Helvetica-Bold'},
    colValue: {flex: 2, fontSize: 11, color: '#000000'},

    // Images
    imageGrid: {flexDirection: 'row', gap: 10, marginBottom: 20},
    imageBox: {width: '31%', height: 120, backgroundColor: '#f4f4f5', borderRadius: 4, overflow: 'hidden'},

    // Tags
    tagContainer: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10},
    tag: {backgroundColor: '#f4f4f5', padding: '4 8', fontSize: 9, color: '#000', borderRadius: 4},

    // Footer
    footer: {position: 'absolute', bottom: 30, left: 50, right: 50, borderTop: '1pt solid #e4e4e7', paddingTop: 10},
    footerText: {fontSize: 8, color: '#a1a1aa', textAlign: 'center', textTransform: 'uppercase'},
});

// --- PDF COMPONENT ---
const DossierPDF = ({data}: { data: any }) => (
    <Document title={`Spec Dossier - ${data.vin}`}>
        {/* PAGE 1: COVER */}
        <Page size="A4" style={styles.page}>
            <View style={styles.coverPage}>
                <View style={styles.accentBar}/>
                <Text style={styles.title}>{data.year} {data.make}</Text>
                <Text style={styles.title}>{data.model}</Text>
                <Text style={styles.subtitle}>{data.trim} • {data.color}</Text>

                <View style={styles.coverFooter}>
                    <Text style={{fontSize: 10, color: '#71717a', textTransform: 'uppercase', marginBottom: 4}}>Chassis
                        / VIN</Text>
                    <Text style={{fontSize: 14, fontFamily: 'Helvetica-Bold'}}>{data.vin}</Text>
                    <Text style={{
                        fontSize: 10,
                        color: '#71717a',
                        textTransform: 'uppercase',
                        marginTop: 20,
                        marginBottom: 4
                    }}>Export Division</Text>
                    <Text style={{fontSize: 12, color: '#ffffff'}}>Providence Auto</Text>
                </View>
            </View>
        </Page>

        {/* PAGE 2: SPECS */}
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>

                <View style={styles.headerBox}>
                    <Text style={styles.headerText}>Vehicle Dossier</Text>
                </View>

                {/* Optional Images */}
                {data.images && data.images.length > 0 && (
                    <View style={styles.imageGrid}>
                        {data.images.slice(0, 3).map((img: string, i: number) => (
                            <View key={i} style={styles.imageBox}>
                                <Image src={img} style={{objectFit: 'cover'}}/>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{flexDirection: 'row', gap: 20}}>
                    {/* Left Col */}
                    <View style={{flex: 1}}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Helvetica-Bold',
                            marginBottom: 10,
                            marginTop: 10
                        }}>IDENTIFICATION</Text>
                        <View style={styles.row}><Text style={styles.colLabel}>VIN</Text><Text
                            style={styles.colValue}>{data.vin}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Engine No.</Text><Text
                            style={styles.colValue}>{data.engineNumber || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Origin</Text><Text
                            style={styles.colValue}>{data.countryOfOrigin}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Mileage</Text><Text
                            style={styles.colValue}>{data.mileage || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Grade</Text><Text
                            style={styles.colValue}>{data.auctionGrade || '-'}</Text></View>

                        <Text style={{fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 10, marginTop: 20}}>INTERIOR
                            & TECH</Text>
                        <View style={styles.row}><Text style={styles.colLabel}>Upholstery</Text><Text
                            style={styles.colValue}>{data.upholstery || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Infotainment</Text><Text
                            style={styles.colValue}>{data.infotainment || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Steering</Text><Text
                            style={styles.colValue}>{data.steering || '-'}</Text></View>
                    </View>

                    {/* Right Col */}
                    <View style={{flex: 1}}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Helvetica-Bold',
                            marginBottom: 10,
                            marginTop: 10
                        }}>MECHANICAL</Text>
                        <View style={styles.row}><Text style={styles.colLabel}>Engine</Text><Text
                            style={styles.colValue}>{data.engineConfig || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Displacement</Text><Text
                            style={styles.colValue}>{data.displacement || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Power</Text><Text
                            style={styles.colValue}>{data.maxPower || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Torque</Text><Text
                            style={styles.colValue}>{data.maxTorque || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Transmission</Text><Text
                            style={styles.colValue}>{data.transmission || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Fuel</Text><Text
                            style={styles.colValue}>{data.fuelSystem || '-'}</Text></View>
                        <View style={styles.row}><Text style={styles.colLabel}>Emissions</Text><Text
                            style={styles.colValue}>{data.emissions || '-'}</Text></View>
                    </View>
                </View>

                {/* Features */}
                {data.features && data.features.length > 0 && (
                    <View style={{marginTop: 20}}>
                        <Text style={{fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 5}}>FEATURES &
                            OPTIONS</Text>
                        <View style={styles.tagContainer}>
                            {data.features.map((feat: string, i: number) => (
                                <Text key={i} style={styles.tag}>{feat}</Text>
                            ))}
                        </View>
                    </View>
                )}

            </View>

            <View style={styles.footer} fixed>
                <Text style={styles.footerText} render={({pageNumber}) => (
                    `Providence Auto • Export Dossier • Page ${pageNumber}`
                )}/>
            </View>
        </Page>
    </Document>
);

// --- HELPER ---
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) chunks.push(chunk as any);
    return Buffer.concat(chunks);
}

// --- SERVER ACTION ---
export async function generateDossierPdfAction(vin: string) {
    try {
        await connectToDatabase();
        const dossierData = await SpecDossier.findOne({vin}).lean();

        if (!dossierData) {
            return {success: false, message: "Dossier not found."};
        }

        // Render PDF to Buffer
        const pdfElement = React.createElement(DossierPDF, {data: dossierData});
        const stream = await renderToStream(pdfElement as any);
        const buffer = await streamToBuffer(stream);

        const fileName = `${dossierData.make}_${dossierData.model}_${vin}.pdf`.replace(/\s+/g, '_');

        return {
            success: true,
            pdfBase64: buffer.toString('base64'),
            fileName: fileName
        };

    } catch (error: any) {
        console.error("PDF Gen Error:", error);
        return {
            success: false,
            message: error.message || "Internal Server Error"
        };
    }
}