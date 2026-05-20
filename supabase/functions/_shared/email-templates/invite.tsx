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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>دعوة للانضمام إلى {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>تمّت دعوتك</Heading>
        <Text style={text}>
          تمّت دعوتك للانضمام إلى{' '}
          <Link href={siteUrl} style={link}><strong>{siteName}</strong></Link>
          . اضغط الزرّ أدناه لقبول الدعوة وإنشاء حسابك.
        </Text>
        <Button style={button} href={confirmationUrl}>قبول الدعوة</Button>
        <Text style={footer}>
          إن لم تكن تتوقّع هذه الدعوة، يمكنك تجاهل هذه الرسالة بأمان.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

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
