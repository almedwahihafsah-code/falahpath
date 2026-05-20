/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>إعادة تعيين كلمة المرور لـ {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>إعادة تعيين كلمة المرور</Heading>
        <Text style={text}>
          تلقّينا طلبًا لإعادة تعيين كلمة المرور لحسابك في {siteName}.
          اضغط الزرّ أدناه لاختيار كلمة مرور جديدة.
        </Text>
        <Button style={button} href={confirmationUrl}>إعادة تعيين كلمة المرور</Button>
        <Text style={footer}>
          إن لم تطلب ذلك، يمكنك تجاهل هذه الرسالة بأمان ولن تتغيّر كلمة مرورك.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
const button = {
  backgroundColor: '#3B4D3C',
  color: '#F5F1E9',
  fontSize: '15px',
  borderRadius: '6px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#8B7456', margin: '32px 0 0' }
