import InfoPage from '../../components/layout/InfoPage'

const infoCards = [
  { title: 'Email', value: 'support@gharwapasi.example.com' },
  { title: 'Helpline', value: '1800-000-0000 (Toll Free)' },
  { title: 'Office', value: 'Ghar Wapasi Group, Bhopal (Sample)' },
  { title: 'Working Hours', value: 'Mon–Sat, 9:00 AM – 7:00 PM' },
]

const sections = [
  {
    heading: 'For Families',
    body: [
      'If you need help with a complaint or want to check its status, log in to the Family portal and view your case, or call the helpline above.',
    ],
  },
  {
    heading: 'For NGOs & Police',
    body: [
      'Police and NGO partners have their own dedicated portals. Please follow the instructions on those portals for coordination and case forwarding.',
    ],
  },
  {
    heading: 'Partnership & Press',
    body: [
      'If you are an NGO, school or community group that would like to work with us, send us a message using the email above. This is currently a demo page.',
    ],
  },
]

function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact Us"
      description="We are here for questions, suggestions and support. This is a demo page, so all details shown are sample data."
      infoCards={infoCards}
      sections={sections}
    />
  )
}

export default ContactPage