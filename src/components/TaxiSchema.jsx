import React from 'react';

/**
 * TaxiSchema Component
 * Injects Google-compliant JSON-LD structured data for TaxiService & LocalBusiness rich snippets.
 */
export const TaxiSchema = ({
  businessName = 'Get Taxi Kovai',
  url = 'https://gettaxikovai.in',
  telephone = '+91-9043743777',
  priceRange = '₹13 - ₹15 per km',
  currenciesAccepted = 'INR',
  ratingValue = '4.9',
  reviewCount = '1840',
  additionalSchema = null,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TaxiService', 'LocalBusiness'],
        '@id': `${url}/#taxiservice`,
        name: businessName,
        alternateName: 'Get Taxi Kovai - Coimbatore Call Taxi',
        description:
          'Premier 24/7 call taxi, outstation drop taxi, airport transfers, and hourly car rentals in Coimbatore and across Tamil Nadu with 100% transparent pricing.',
        url: url,
        telephone: telephone,
        priceRange: priceRange,
        currenciesAccepted: currenciesAccepted,
        paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
        image: `${url}/images/brand/og-banner.webp`,
        logo: `${url}/images/brand/logo.webp`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Gandhipuram Central',
          addressLocality: 'Coimbatore',
          addressRegion: 'Tamil Nadu',
          postalCode: '641012',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 11.0168,
          longitude: 76.9558,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        areaServed: [
          { '@type': 'City', name: 'Coimbatore' },
          { '@type': 'City', name: 'Tirupur' },
          { '@type': 'City', name: 'Erode' },
          { '@type': 'City', name: 'Salem' },
          { '@type': 'City', name: 'Ooty' },
          { '@type': 'City', name: 'Kodaikanal' },
          { '@type': 'City', name: 'Madurai' },
          { '@type': 'City', name: 'Trichy' },
        ],
        knowsAbout: [
          'Outstation Cabs',
          'One Way Drop Taxi',
          'Airport Taxi Service',
          'Hourly Car Rental',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: ratingValue,
          bestRating: '5',
          worstRating: '1',
          ratingCount: reviewCount,
          reviewCount: reviewCount,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: telephone,
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'ta'],
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Taxi Services & Tariffs',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Round Trip Outstation Taxi',
                description: 'Outstation round trips starting from ₹13/km with sedan & SUV options.',
              },
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '13.00',
                priceCurrency: 'INR',
                unitText: 'km',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'One Way Drop Taxi',
                description: 'Inter-city drop taxi across Tamil Nadu starting from ₹14/km.',
              },
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '14.00',
                priceCurrency: 'INR',
                unitText: 'km',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Hourly City Car Rental',
                description: 'Local executive rental packages with 10 km free per hour.',
              },
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '350.00',
                priceCurrency: 'INR',
                unitText: 'hour',
              },
            },
          ],
        },
        ...(additionalSchema || {}),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default TaxiSchema;
