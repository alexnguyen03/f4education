import React, { useEffect, useState } from 'react'

import {
    Document,
    Font,
    Image,
    Page,
    PDFViewer,
    StyleSheet,
    Text,
    View
} from '@react-pdf/renderer'

// QRCODE
import QRCode from 'qrcode'

// format
import moment from 'moment/moment'

// Register font and assets import
import logo from '../../assets/img/brand/F4EDUCATION.png'
import rectangle from '../../assets/img/rectangle.png'
import rectangle2 from '../../assets/img/rectangle2.png'

import fontSource1 from '../../assets/fonts/kenyan coffee rg.otf'
import fontSource2 from '../../assets/fonts/kenyan coffee rg it.otf'
import fontSource3 from '../../assets/fonts/kenyan coffee bd.otf'
import fontSource4 from '../../assets/fonts/kenyan coffee bd it.otf'

// API
import certificateApi from '../../api/certificateApi'

// Register new custom font
Font.register({
    family: 'kenyan',
    fonts: [
        { src: fontSource1 },
        { src: fontSource2, fontStyle: 'italic', fontWeight: 'normal' },
        { src: fontSource3, fontStyle: 'normal', fontWeight: 700 },
        { src: fontSource4, fontStyle: 'italic', fontWeight: 700 }
    ]
})

// Create styles
const styles = StyleSheet.create({
    page: {
        // backgroundColor: '#f7f7f7',
        backgroundColor: '#fff',
        color: '#000',
        flexDirection: 'column',
        fontFamily: 'kenyan',
        padding: 45,
        letterSpacing: 0.5,
        position: 'relative'
    },
    flexSection: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    floatSection: {
        position: 'absolute',
        left: 40,
        right: 40,
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    mainContent: {
        fontSize: 20,
        marginTop: 50,
        marginBottom: 60
    },
    viewer: {
        width: '100%',
        height: '100%'
    },
    image: {
        width: '148px',
        height: '43px',
        objectFit: 'cover'
    },
    textLg: {
        fontSize: 25,
        fontWeight: 'normal'
    },
    textMd: {
        fontSize: 35,
        fontWeight: 'normal',
        marginBottom: 5
    }
})

const CertificateDownload = ({ certificateId }) => {
    // QR code
    const [qrCodeImage, setQrCodeImage] = useState('')

    // Main variable
    const [certificate, setCertificate] = useState({})
    const [courseName, setCourseName] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)

            const resp = await certificateApi.getAllCertificateByCertificateId(
                certificateId
            )

            if (resp.status === 200) {
                setCertificate(resp.data)

                const str = resp.data.certificateName
                const prefix = 'Chứng chỉ xác nhận hoàn thành khóa học'
                const value = str
                    .substring(str.indexOf(prefix) + prefix.length)
                    .trim()
                setCourseName(value)
            }

            // QR code
            const url = window.location.href

            // Generate QR code as an image
            const qrCodeDataURL = await QRCode.toDataURL(url)

            setQrCodeImage(qrCodeDataURL)

            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    // FETCH
    useEffect(() => {
        fetchData()
    }, [certificateId])

    return (
        <>
            <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page} orientation="landscape">
                    {/* Header */}
                    <View style={styles.flexSection}>
                        {loading ? (
                            <></>
                        ) : (
                            <Image style={styles.image} source={logo} />
                        )}

                        <View
                            style={{
                                flexDirection: 'column',
                                textAlign: 'right'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    color: '#212121',
                                    fontWeight: 500
                                }}
                            >
                                Trung Tâm Đào Tạo Lập Trình Ngắn Hạn
                            </Text>
                            <Text
                                style={{
                                    fontSize: 25,
                                    color: '#5e17eb',
                                    fontWeight: 500,
                                    margin: '0 auto',
                                    letterSpacing: 1
                                }}
                            >
                                F4 EDUCATION
                            </Text>
                        </View>
                    </View>

                    {loading ? (
                        <></>
                    ) : (
                        <>
                            {/* Content */}
                            <View style={styles.mainContent}>
                                <Text
                                    style={{
                                        fontSize: 45,
                                        color: '#000',
                                        fontWeight: 500
                                    }}
                                >
                                    CHỨNG CHỈ XÁC NHẬN TỐT NGHIỆP
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 25,
                                        color: '#9c9c9c'
                                    }}
                                >
                                    Được cấp cho
                                </Text>
                                <Text
                                    style={{
                                        marginBottom: 25,
                                        marginTop: 25,
                                        fontSize: 35
                                    }}
                                >
                                    {!loading && certificate.studentName}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 25,
                                        color: '#9c9c9c'
                                    }}
                                >
                                    Tốt nghiệp khóa học
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 30,
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                >
                                    {courseName}
                                </Text>
                            </View>
                        </>
                    )}

                    {/* Footer */}
                    <View style={styles.floatSection}>
                        {/* Left */}
                        <View
                            style={{
                                flexDirection: 'column',
                                textAlign: 'right'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: '#8f8f8f',
                                    fontWeight: 500
                                }}
                            >
                                Được cấp ngày:{' '}
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: '#212121',
                                        fontWeight: 500
                                    }}
                                >
                                    {moment(certificate.createDate).format(
                                        'DD-MM-yyyy'
                                    )}
                                </Text>
                            </Text>
                        </View>
                        {/* Right */}
                        <View
                            style={{
                                flexDirection: 'column',
                                textAlign: 'right',
                                zIndex: 1
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: '#8f8f8f',
                                    fontWeight: 500,
                                    zIndex: 1
                                }}
                            >
                                Đã được ký tên bởi giám đốc
                            </Text>
                        </View>
                    </View>

                    {/* Overflow image */}
                    {loading ? (
                        <></>
                    ) : (
                        <>
                            <Image
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: -100,
                                    width: '300px',
                                    height: '300px',
                                    zIndex: -1
                                }}
                                source={rectangle}
                            />

                            <Image
                                style={{
                                    position: 'absolute',
                                    bottom: 110,
                                    right: -60,
                                    width: '300px',
                                    height: '300px',
                                    zIndex: -1000
                                }}
                                source={rectangle2}
                            />
                        </>
                    )}
                </Page>
                {/* Use Image component to include QR code in the PDF */}
                {loading ? (
                    <></>
                ) : (
                    <Image
                        style={{
                            width: '100px',
                            height: 100,
                            position: 'absolute',
                            bottom: 35,
                            right: 240
                        }}
                        source={loading === false && qrCodeImage}
                    />
                )}
            </Document>
        </>
    )
}

export default CertificateDownload
