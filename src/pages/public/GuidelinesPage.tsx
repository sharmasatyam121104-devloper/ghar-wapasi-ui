import InfoPage from '../../components/layout/InfoPage'

const sections = [
  {
    heading: 'Reporting Responsibly',
    body: [
      'Always share accurate details — the correct name, age, last known location and any helpful information you remember. Wrong or outdated information can delay a case.',
      'When uploading a photo, make sure it is a recent image of the person and does not include anyone else.',
    ],
  },
  {
    heading: 'Privacy & Safety',
    body: [
      'Personal details are only visible to registered officials such as police and NGO staff. The general public only sees the name, photo and last seen location of the person.',
      'Do not share personal phone numbers or selfies in a report unless they are necessary.',
    ],
  },
  {
    heading: 'Photo Search Rules',
    body: [
      'Only upload photos that you have taken yourself or have permission to share when using the AI photo search.',
      'Photo search can only be used for finding missing persons — no other use is allowed.',
    ],
  },
  {
    heading: 'Alerts & Priority Cases',
    body: [
      'Cases involving women, senior citizens and children are broadcast instantly within a 6 km radius. These alerts are for information only — please do not take the law into your own hands.',
      'In any emergency, contact the police immediately. This platform is a supporting network, not an emergency service.',
    ],
  },
]

function GuidelinesPage() {
  return (
    <InfoPage
      eyebrow="Guidelines"
      title="Community Guidelines"
      description="A few simple rules that keep the platform safe, accurate and respectful for everyone. This page is a sample and will be updated later."
      sections={sections}
    />
  )
}

export default GuidelinesPage