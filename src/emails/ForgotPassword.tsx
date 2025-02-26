import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,  // implement a button later after project completion.
} from '@react-email/components';

interface ForgotPasswordProps {
    fullName: string;
    username: string;
    otp: string;
}

export default function ForgotPassword({ fullName, username, otp }: ForgotPasswordProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Reset Password Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Open email to reset password.</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {fullName},</Heading>
                </Row>
                <Row>
                    <Text>
                        You have requested to reset your password.
                        Please click on the following button to proceed:
                    </Text>
                </Row>

                <Row>
                    <Button
                        href={`${process.env.APP_DOMAIN}/reset-password/${username}?code=${otp}`}
                        style={{
                            backgroundColor: '#0F52BA',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: 'none',
                            fontSize: '16px',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                    >
                        Reset Password Here
                    </Button>
                </Row>

                <Row>
                    <Text>
                        If you did not request this code, please ignore this email.
                    </Text>
                </Row>
               
            </Section>
        </Html>
    );
}