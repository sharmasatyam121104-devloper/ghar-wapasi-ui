import InfoPage from '../../components/layout/InfoPage'

const sections = [
  {
    heading: 'Our Mission',
    body: [
      'Ghar Wapasi is a community network that helps reunite missing people with their families. We bring families, police, NGOs and everyday citizens onto one platform so that missing person cases are resolved faster.',
      'Every report, photo and alert is designed to move a person one step closer to home.',
    ],
  },
  {
    heading: 'How It Works',
    body: [
      'A family files a report with the missing person’s photo and last known location. AI photo search and instant alerts within a 6 km radius quickly notify the surrounding community.',
      'Cases involving women, senior citizens and children are flagged as priority alerts and broadcast to every registered user in the area.',
    ],
  },
  {
    heading: 'Who We Help',
    body: [
      'Families searching for their loved ones, volunteers helping with the search, police departments and NGOs — each group has its own dedicated portal where all work happens in one place.',
    ],
  },
  {
    heading: 'Our Partners',
    body: [
      'We work alongside police departments, local NGOs and community volunteers. This is currently a demo build, so all data shown is sample data and no partner list has been added yet.',
    ],
  },
]

function AboutPage() {
  return (
    <InfoPage
      eyebrow="About Us"
      title="About Ghar Wapasi"
      description="A community network that helps missing people find their way back home — simple, safe and built for the people who search."
      sections={sections}
    />
  )
}

export default AboutPage