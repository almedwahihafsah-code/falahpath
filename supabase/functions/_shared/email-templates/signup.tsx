/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>تأكيد بريدك الإلكتروني لـ {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>الفلاح</Heading>
        <Text style={text}>
          نرحّب بك في{' '}
          <Link href={siteUrl} style={link}><strong>{siteName}</strong></Link>
          {' '}— رحلتك نحو التحوّل القرآني تبدأ من هنا.
        </Text>
        <Text style={text}>
          يرجى تأكيد بريدك الإلكتروني (
          <Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>
          ) للمتابعة:
        </Text>
        <Button style={button} href={confirmationUrl}>تأكيد البريد</Button>
        <Text style={footer}>
          إن لم تقم بإنشاء حساب، يمكنك تجاهل هذه الرسالة بأمان.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Tajawal, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#3B4D3C',
  margin: '0 0 24px',
}
const text = {
  fontSize: '15px',
  color: '#3B4D3C',
  lineHeight: '1.7',
  margin: '0 0 20px',
}
const link = { color: '#8B7456', textDecoration: 'underline' }
const button = {
  backgroundColor: '#3B4D3C',
  color: '#F5F1E9',
  fontSize: '15px',
  borderRadius: '6px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#8B7456', margin: '32px 0 0' }
