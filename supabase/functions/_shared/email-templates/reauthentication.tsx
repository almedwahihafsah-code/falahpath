/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>رمز التحقّق الخاص بك</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>تأكيد هويّتك</Heading>
        <Text style={text}>استخدم الرمز أدناه لتأكيد هويّتك:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          تنتهي صلاحية هذا الرمز قريبًا. إن لم تطلب ذلك، يمكنك تجاهل هذه الرسالة بأمان.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: '#3B4D3C',
  letterSpacing: '4px',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#8B7456', margin: '32px 0 0' }
