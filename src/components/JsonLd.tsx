export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'MusicVenue'],
        '@id': 'https://cabinstudio.com/#business',
        name: 'Cabin Studio',
        alternateName: ['Cabin Studio Chicago', 'Sabini Studio'],
        description:
          'Professional recording studio in Chicago offering recording, mixing, mastering, and beat production. Located at 345 N Loomis St, Unit #501. Warm, intimate studio environment for rap, R&B, indie, and all genres.',
        url: 'https://cabinstudio.com',
        email: 'sabinistudio@gmail.com',
        sameAs: ['https://instagram.com/sabinistudio'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '345 N Loomis St, Unit #501',
          addressLocality: 'Chicago',
          addressRegion: 'IL',
          postalCode: '60607',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.8859,
          longitude: -87.6566,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        priceRange: '$89–$240',
        currenciesAccepted: 'USD',
        paymentAccepted: 'Credit Card, Cash, Venmo, CashApp',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Recording Studio Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: '2 Hour Recording Session' },
              price: '120',
              priceCurrency: 'USD',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: '3 Hour Recording Session' },
              price: '180',
              priceCurrency: 'USD',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: '4 Hour Recording Session' },
              price: '240',
              priceCurrency: 'USD',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Essential Mixing & Mastering' },
              price: '89',
              priceCurrency: 'USD',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Premium Mixing & Mastering' },
              price: '149',
              priceCurrency: 'USD',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Custom Beat Production' },
              price: '99',
              priceCurrency: 'USD',
            },
          ],
        },
        keywords:
          'recording studio Chicago, music studio Chicago, mixing and mastering Chicago, cabin studio Chicago, Sabini studio Chicago',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
