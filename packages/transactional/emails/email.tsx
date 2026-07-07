import {
  Button,
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Link,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

interface EmailProps {
  description?: string;
  link?: string;
  subject?: string;
}

export const Email = ({ description, link, subject }: EmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}>
        <Body className="font-sans bg-slate-50 p-5">
          <Container className="max-w-xl mx-auto bg-white rounded-xl overflow-hidden shadow-md">
            {/* Header */}
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🤖</div>
              <Heading className="text-black text-2xl font-bold m-0">
                Clerkwise AI
              </Heading>
            </div>

            {/* Content */}
            <div className="p-10">
              <Heading className="text-slate-800 text-xl mb-5 text-center">
                {subject}
              </Heading>

              <Text className="text-gray-600 text-base leading-relaxed mb-8 text-center">
                {description}
              </Text>

              <div className="text-center mb-8">
                <Button
                  href={link}
                  className="px-6 py-3 rounded-lg font-semibold shadow-md inline-block">
                  Reset Password
                </Button>
              </div>

              <Text className="text-gray-500 text-sm text-center mb-4">
                If the button doesn't work, copy and paste this link into your
                browser:
              </Text>

              <Link
                href={link}
                className="text-blue-600 wrap-break-words text-center block text-sm">
                {link}
              </Link>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-5 text-center border-t">
              <Text className="text-gray-500 text-xs m-0">
                This link will expire in 24 hours for security reasons.
              </Text>
              <Text className="text-gray-500 text-xs mt-2">
                If you didn't request this password reset, please ignore this
                email.
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

Email.PreviewProps = {
  description: "Click the button below to reset your password.",
  link: "https://example.com/reset-password",
  subject: "Reset your password",
} as EmailProps;

export default Email;
