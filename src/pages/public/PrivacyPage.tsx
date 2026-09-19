import InfoPage from '../../components/layout/InfoPage'

const sections = [
  {
    heading: 'Data We Collect',
    body: [
      'We collect your name, contact details, the information you provide in your complaint and the photos you upload. This data is used only to help find the missing person.',
      'Since this is a demo build, no real data is stored — everything shown is sample data.',
    ],
  },
  {
    heading: 'How Your Data Is Used',
    body: [
      'Your details are used only to resolve the case, send you updates and coordinate with police or NGO partners.',
      'The general public only sees the name, photo and last seen location. Full contact information stays private.',
    ],
  },
  {
    heading: 'Who Can See Your Data',
    body: [
      'Full details are accessible only to registered and verified officials such as police and NGO staff. Authorized users are allowed to view data only after their accounts are verified.',
    ],
  },
  {
    heading: 'Data Retention & Your Rights',
    body: [
      'After a case is resolved, data is retained only for tracking purposes. You can request to correct or delete your personal data at any time.',
      'This policy is currently a sample template and will be updated before the final launch.',
    ],
  },
]

function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      description="Your privacy comes first. This page explains what data we collect and why we use it."
      sections={sections}
    />
  )
}

export default PrivacyPage