import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@constants/metrics';
import { useThemeContext } from '@theme/ThemeProvider';
import Header from '@components/ui/Header';
import LinearGradient from 'react-native-linear-gradient';

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const renderList = (items, keyPrefix) =>
    Array.isArray(items) && items.length ? (
      <View style={styles.listContainer}>
        {items.map((item, index) => (
          <View key={`${keyPrefix}-${index}`} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    ) : null;

  const renderSection5Item = (item, index) => (
    <View key={`privacy-section5-item-${index}`} style={styles.sectionItem}>
      <Text style={styles.sectionSubtitle}>{item.title}</Text>
      <Text style={styles.paragraph}>{item.examples}</Text>
      {item.purpose_list?.length ? (
        <>
          <Text style={styles.boldText}>Purpose of Processing:</Text>
          {renderList(
            item.purpose_list,
            `privacy-section5-item-${index}-purpose`,
          )}
        </>
      ) : null}
      {item.legal_list?.length ? (
        <>
          <Text style={styles.boldText}>Legal Basis:</Text>
          {renderList(item.legal_list, `privacy-section5-item-${index}-legal`)}
        </>
      ) : null}
    </View>
  );

  const openWebsite = () => {
    Linking.openURL('https://www.eSanad.com');
  };

  const openEmail = () => {
    Linking.openURL('mailto:hello@esanad.com');
  };

  const section5Items = [
    {
      title:
        '1. Personal Identification and Contact Information (Proposed Insured Individuals)',
      examples:
        'Examples: Name, gender, marital status, date and place of birth, nationality, residency status, occupation, policy number (if applicable), business and residential addresses, telephone and mobile numbers, relationship to the policyholder, and other data required for identity verification.',
      purpose_list: [
        'Verifying identity and eligibility',
        'Managing customer interactions and service delivery',
        'Responding to enquiries, applications, and feedback',
        'Administering user accounts and policy-related activities',
        'Ensuring compliance with internal controls and CBUAE regulatory requirements',
      ],
      legal_list: [
        'Performance of contractual obligations',
        'Compliance with legal and regulatory obligations',
      ],
    },
    {
      title:
        '2. Personal Identification and Contact Information (Policy Owners)',
      examples:
        'Examples: Same categories of information as above, applicable to individuals who hold or manage existing insurance policies.',
      purpose_list: [
        'Verifying identity',
        'Administering insurance contracts and policy information',
        'Meeting statutory and regulatory reporting requirements',
      ],
      legal_list: [
        'Performance of contractual obligations',
        'Compliance with legal and regulatory obligations',
      ],
    },
    {
      title: '3. Insurance Information',
      examples:
        'Examples: Payment records, premium payment history, tax documentation (if applicable), policy details, transaction records, billing information, and other insurance-related data.',
      purpose_list: [
        'Processing insurance-related transactions and payments',
        'Conducting internal and external audits',
        'Providing customer support and resolving service enquiries',
        'Enhancing service quality through analytics and automated processing',
        'Detecting, investigating, and preventing fraud or misuse',
        'Satisfying legal, regulatory, and reporting obligations',
      ],
      legal_list: [
        'Performance of contractual obligations',
        'Compliance with legal and regulatory obligations',
      ],
    },
    {
      title: '4. Policy Information',
      examples:
        'Examples: Insurance policy type, coverage levels, supplementary benefits or riders, terms and conditions, beneficiary information, policy endorsements or amendments, renewal history, and customer feedback related to the policy.',
      purpose_list: [
        'Administering and managing insurance policies',
        'Improving customer experience through analytics, insights, and automation',
        'Managing customer relationships and service interactions',
        'Communicating policy updates, changes, or renewals',
        'Supporting claims-related processes where applicable to brokers (e.g., coordination, submission routing, updates), without acting as a risk carrier',
      ],
      legal_list: [
        'Performance of contractual obligations',
        'Compliance with legal and regulatory obligations',
        'Legitimate interests (such as policy administration, service optimization, and fraud prevention), where permitted by law',
      ],
    },
    {
      title: '5. Marketing Information',
      examples:
        'Examples: Marketing interaction data, communication preferences, subscription status, opt-in/opt-out records, and consent logs related to marketing communications.',
      purpose_list: [
        'Sending marketing and promotional communications about our Services',
        'Managing communication and marketing preferences',
        'Analysing customer engagement and marketing performance',
        'Providing relevant educational, awareness, or promotional materials related to our Services',
      ],
      legal_list: [
        'Consent (for receiving marketing communications)',
        'Legitimate interests (for analysing performance, managing preferences, and improving outreach), where permitted under UAE law',
      ],
    },
    {
      title: '6. Monitoring and Technical Information',
      examples:
        'Examples: CCTV footage at eSanad premises, cookies, web beacons, pixels, device identifiers, IP addresses, browser type, operating system details, browsing behaviour, session data, and interactions with our website or mobile applications.',
      purpose_list: [
        'Ensuring physical and digital security, including CCTV monitoring',
        'Monitoring website and application interactions to maintain system integrity',
        'Enhancing and personalizing user experience on digital platforms',
        'Detecting, preventing, and investigating fraud, unauthorized access, or misuse',
      ],
      legal_list: [
        'Legitimate interests (security monitoring, fraud prevention, platform optimisation)',
        'Consent (for cookies, tracking technologies, and similar digital identifiers where required by law)',
      ],
    },
    {
      title: '7. Compliance Information',
      examples:
        'Examples: Financial information, communication logs, business-related data, compliance monitoring records, audit trails, internal or external compliance reports, and records of interactions with regulatory authorities.',
      purpose_list: [
        'Ensuring compliance with applicable UAE laws, regulations, and supervisory requirements',
        'Handling, investigating, and resolving complaints and disputes',
        'Conducting internal audits, compliance reviews, and quality assurance checks',
        'Managing regulatory inspections, enquiries, reporting requirements, or investigations initiated by the CBUAE or other competent authorities',
      ],
      legal_list: ['Compliance with legal and regulatory obligations'],
    },
    {
      title: '8. Contract Information',
      examples:
        'Examples: Contracts and agreements entered into between you and eSanad, as well as relevant third-party contracts that may affect your relationship or transactions with eSanad.',
      purpose_list: [
        'Managing, administering, and fulfilling contractual relationships with you',
        'Assessing or reviewing third-party agreements that impact your interactions with us',
        'Addressing complaints, disputes, and service-related concerns',
        'Exercising, enforcing, or defending contractual rights and obligations',
      ],
      legal_list: [
        'Performance of contractual obligations',
        'Compliance with legal obligations',
      ],
    },
    {
      title: '9. Sensitive Personal Data',
      examples:
        'Examples: Sensitive Personal Data may include medical history, medical reports, treatments, diagnoses, health conditions, prescribed medications, laboratory results, and other health-related information required for insurance purposes. It may also, in limited circumstances, include Personal Data that reveals racial or ethnic origin, religious or philosophical beliefs, or criminal records, where such information is required for risk assessment or compliance purposes.',
      purpose_list: [
        'Providing insurance-related services where processing of Sensitive Personal Data is required (e.g., health insurance, life insurance, or other products requiring medical underwriting)',
        'Facilitating policy issuance, medical underwriting, and claims assistance in accordance with our permitted role as an insurance intermediary (not a risk carrier)',
        'Supporting insurers in evaluating eligibility, risk, and coverage decisions in line with regulatory requirements',
      ],
      legal_list: [
        'Explicit consent provided by you for the processing of Sensitive Personal Data',
        'Performance of contractual obligations, where such processing is necessary to arrange or administer insurance products or Services requested by you',
      ],
    },
  ];

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}
      locations={[0.1, 0.2]}
      colors={[theme.colors.bgLinear1, theme.colors.bgLinear2]}
      style={styles.container}
    >
      <Header title="Privacy Policy" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.mainTitle}>Privacy Notice</Text>
          <Text style={styles.paragraph}>
            We believe your Personal Data must always be respected, handled with
            care, and protected. eSanad is committed to safeguarding your
            information and using it only when necessary to deliver our
            Services, enhance your decision-making, and improve your overall
            experience across our digital and traditional channels.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Who We Are and What We Do</Text>
          <Text style={styles.paragraph}>
            eSanad – Success Insurance Services L.L.C. ("eSanad", "we", "us" or
            "our") is a UAE-licensed insurance brokerage offering insurance
            intermediary services through both traditional channels and a fully
            digital insurance platform. We enable customers to discover,
            compare, and purchase a wide range of insurance products — including
            Motor, Health, Travel, Home, Life, and other insurance solutions —
            based on their needs and preferences (the "Services").
          </Text>
          <Text style={styles.paragraph}>
            As an insurance intermediary regulated by the Central Bank of the
            UAE ("CBUAE"), we operate strictly as a broker, not as an insurer or
            risk carrier. We do not underwrite, issue, or assume insurance risk.
            Our role is to facilitate the insurance journey by presenting
            quotations from licensed insurers, supporting customers in
            evaluating available options, and connecting them with UAE-licensed
            insurance companies for policy issuance.
          </Text>
          <Text style={styles.paragraph}>
            To learn more about us, please visit:{' '}
            <Text style={styles.link} onPress={openWebsite}>
              www.eSanad.com
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            We believe your Personal Data must always be respected, handled with
            care, and protected. eSanad is committed to safeguarding your
            information and using it only when necessary to deliver our
            Services, enhance your decision-making, and improve your overall
            experience across our digital and traditional channels.
          </Text>
          <Text style={styles.paragraph}>
            This Privacy Notice explains in detail how we collect, use, process,
            disclose, and safeguard your Personal Data. It applies to
            individuals who interact with us, make enquiries, compare insurance
            quotations, or obtain any products or Services from eSanad for
            personal, family, or household purposes.
          </Text>
          <Text style={styles.paragraph}>
            For the purposes of this Privacy Notice, references to "eSanad",
            "we", "us", or "our" include the Company, its successors, and any
            permitted assigns, transferees, or purchasers of its rights and
            obligations. References to "you" or "your" mean the individual using
            our Services, accessing our website or applications, or otherwise
            providing information to us, and includes your successors and
            permitted assigns, as applicable.
          </Text>
          <Text style={styles.paragraph}>
            Our privacy commitments reflect the core principles of how we
            operate as a trusted digital insurance brokerage. These commitments
            apply to all individuals who interact with us — including customers,
            prospective customers, partners, service providers, and visitors to
            our digital platforms — except where otherwise required by law.
          </Text>
          <Text style={styles.paragraph}>
            eSanad is dedicated to delivering a high-quality, seamless customer
            experience across all our Services. We balance the need to use
            Personal Data to deliver reliable and efficient services with our
            obligation to protect your privacy at all times.
          </Text>
          <Text style={styles.paragraph}>
            For the purposes of this Privacy Notice, eSanad acts as the Data
            Controller, meaning we determine how your Personal Data is
            collected, used, safeguarded, and retained in accordance with
            applicable laws and regulations of the United Arab Emirates.
          </Text>

          <Text style={styles.boldText}>Definitions</Text>
          <Text style={styles.paragraph}>
            Unless stated otherwise, the terms used in this Privacy Notice shall
            have the meanings assigned to them under the applicable laws and
            regulations of the United Arab Emirates, including the UAE Personal
            Data Protection Law (Federal Decree-Law No. 45 of 2021).
          </Text>

          <Text style={styles.boldText}>Personal Data</Text>
          <Text style={styles.paragraph}>
            "Personal Data" means any information relating to an identified
            natural person, or a natural person who can be identified directly
            or indirectly by reference to one or more identifiers. These
            identifiers may include, without limitation:
          </Text>
          {renderList(
            [
              'name',
              'voice',
              'image',
              'identification number',
              'online identifier (such as IP address or device ID)',
              'geographic location',
              "or any characteristics that reveal the individual's physical, psychological, economic, cultural, or social identity",
            ],
            'personal-data-list',
          )}
          <Text style={styles.paragraph}>
            Personal Data also includes Sensitive Personal Data and Biometric
            Data, as defined under applicable UAE laws.
          </Text>

          <Text style={styles.boldText}>Sensitive Personal Data</Text>
          <Text style={styles.paragraph}>
            "Sensitive Personal Data" refers to Personal Data that directly or
            indirectly reveals:
          </Text>
          {renderList(
            [
              'family information',
              'racial or ethnic origin',
              'political or philosophical opinions',
              'religious beliefs',
              'criminal records',
              'biometric identifiers (such as fingerprints or facial geometry)',
              "health-related data, including information about a person's physical, psychological, mental, genetic, or sexual condition, as well as details of any healthcare services provided that may reveal their health status",
            ],
            'sensitive-data-list',
          )}

          <Text style={styles.boldText}>Definitions</Text>
          <Text style={styles.paragraph}>
            Unless stated otherwise, the terms used in this Privacy Notice shall
            follow the definitions under the UAE Personal Data Protection Law
            (Federal Decree-Law No. 45 of 2021).
          </Text>

          <Text style={styles.boldText}>Personal Data</Text>
          <Text style={styles.paragraph}>
            "Personal Data" means any information relating to an identified or
            identifiable natural person, including:
          </Text>
          {renderList(
            [
              'name',
              'voice',
              'image',
              'identification number',
              'online identifier (IP address, device ID)',
              'geographic location',
              'or characteristics revealing identity',
            ],
            'personal-data-definition-list',
          )}

          <Text style={styles.boldText}>Sensitive Personal Data</Text>
          <Text style={styles.paragraph}>
            "Sensitive Personal Data" includes information revealing:
          </Text>
          {renderList(
            [
              'family information',
              'racial or ethnic origin',
              'political or philosophical views',
              'religious beliefs',
              'criminal records',
              'biometric identifiers',
              'health-related details',
            ],
            'sensitive-data-definition-list',
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. About This Privacy Notice</Text>
          <Text style={styles.paragraph}>
            This Privacy Notice ("Notice") explains how eSanad collects, uses,
            stores, processes, and protects your Personal Data when you interact
            with us. The type of Personal Data we collect and the way we process
            it depend on your relationship with us and the channels through
            which you access our Services, including our website, mobile
            applications, and other digital platforms.
          </Text>
          <Text style={styles.paragraph}>
            Please read this Notice carefully. Any questions or requests
            relating to this Notice or your Personal Data should be directed to
            us using the contact details provided at the end of this document.
          </Text>
          <Text style={styles.paragraph}>
            This Notice provides detailed information on how we handle Personal
            Data relating to:
          </Text>
          {renderList(
            [
              'visitors to our website and digital platforms',
              'current and prospective customers',
              'service providers and vendors',
              'business partners',
              'shareholder nominees',
              'regulatory officials',
              'media representatives and other third parties',
            ],
            'notice-scope-list',
          )}
          <Text style={styles.paragraph}>
            This Notice is issued in accordance with, and is aligned with, our
            obligations under applicable United Arab Emirates laws and
            regulations, including:
          </Text>
          {renderList(
            [
              'Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL)',
              'Federal Decree-Law No. 48 of 2023 on the Regulation of Insurance Activities',
              'CBUAE Insurance Brokerage Regulation C1/2024 (effective 15 February 2025)',
              'Insurance Authority Resolution No. 18 of 2020 concerning Electronic Insurance Regulations',
            ],
            'regulations-list',
          )}
          <Text style={styles.paragraph}>
            Please note that this Notice does not apply to any third-party
            websites or services that you may access through our digital
            platforms. eSanad is not responsible for the privacy practices, use,
            or protection of Personal Data provided to external websites. We
            strongly recommend reviewing the Privacy Notice of each third party
            before submitting any Personal Data.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            3. How We Process Your Personal Data
          </Text>
          <Text style={styles.paragraph}>
            We collect, use, store, process, protect, and disclose your Personal
            Data and Sensitive Personal Data in accordance with the data
            protection laws of the United Arab Emirates ("UAE"), including
            Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data
            (PDPL), as well as all other applicable laws, regulations, and
            supervisory requirements ("Applicable Laws").
          </Text>
          <Text style={styles.paragraph}>
            We process your Personal Data only when necessary and for lawful
            purposes, which include:
          </Text>
          {renderList(
            [
              'providing, administering, and managing the Services you request',
              'enabling access to our website, mobile applications, and digital platforms',
              'verifying your identity and preventing fraud',
              'responding to your enquiries and maintaining communications',
              'fulfilling our legal and regulatory obligations as a licensed insurance broker regulated by the CBUAE',
            ],
            'processing-purposes-list',
          )}

          <Text style={styles.boldText}>Consent-Based Processing</Text>
          <Text style={styles.paragraph}>
            In certain cases, we rely on your explicit consent to process your
            Personal Data—for example, when processing Sensitive Personal Data
            or when consent is required under the PDPL.
          </Text>
          <Text style={styles.paragraph}>
            You may withdraw your consent at any time by contacting us using the
            information provided in this Notice, except where withdrawal is
            restricted under Applicable Laws.
          </Text>
          <Text style={styles.paragraph}>
            Withdrawal becomes effective within one (1) month of receipt. Where
            necessary, we may extend the timeline by an additional two (2)
            months, and you will be informed of the reason for the delay.
            Withdrawal does not affect the legality of processing carried out
            before your withdrawal.
          </Text>

          <Text style={styles.boldText}>Direct Marketing Consent</Text>
          <Text style={styles.paragraph}>
            We will obtain your explicit consent before using your Personal Data
            for direct marketing activities. You will always be provided with
            the option to:
          </Text>
          {renderList(
            [
              'object to direct marketing',
              'withdraw your consent or opt out at any time',
            ],
            'marketing-options-list',
          )}
          <Text style={styles.paragraph}>
            Your marketing preferences will be updated promptly and in
            accordance with Applicable Laws.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            4. Categories of Personal Data We Collect, Purposes, and Legal Basis
            for Processing
          </Text>
          <Text style={styles.paragraph}>
            We collect and process different categories of Personal Data
            depending on your relationship with us and the Services you use. All
            Personal Data is collected and processed in accordance with this
            Privacy Notice and only for purposes that are lawful, necessary, and
            compliant with applicable UAE laws and regulations.
          </Text>
          <Text style={styles.paragraph}>
            We use your Personal Data for various business, operational,
            regulatory, and service-related purposes. The legal basis for
            processing may differ based on your interaction with us and the
            nature of the Services provided. We do not process Personal Data for
            any purpose that is incompatible with those described in this
            Notice.
          </Text>
          <Text style={styles.paragraph}>
            eSanad processes Personal Data strictly for the purposes set out in
            this Notice and relies on lawful bases permitted under UAE data
            protection laws, including:
          </Text>
          {renderList(
            [
              'Performance of contractual obligations: When processing is necessary to enter into, perform, or administer a contract with you.',
              'Compliance with legal and regulatory requirements: When processing is required to comply with CBUAE regulations, insurance laws, anti-fraud obligations, and other applicable UAE laws.',
              'Explicit consent: When you have provided clear consent for specific processing activities (e.g., marketing, Sensitive Personal Data).',
              'Legitimate interests: When processing is necessary for the legitimate interests of eSanad or a third party, provided such interests do not conflict with your rights under the PDPL.',
            ],
            'legal-bases-list',
          )}
          <Text style={styles.paragraph}>
            A detailed table outlining the categories of Personal Data we
            collect, the purposes for which they are processed, and the
            corresponding legal basis is provided in the following section.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            5. Categories of Personal Data We Collect, Purposes of Processing,
            and Legal Basis
          </Text>
          {section5Items.map((item, index) => renderSection5Item(item, index))}

          <Text style={styles.boldText}>
            Contractual Requirement to Provide Personal Data
          </Text>
          <Text style={styles.paragraph}>
            In certain circumstances — particularly where you have entered into,
            or intend to enter into, an insurance-related contract with us —
            providing specific Personal Data, including Sensitive Personal Data,
            may be a contractual requirement. Such information is necessary for
            us to:
          </Text>
          {renderList(
            [
              'perform pre-contractual steps at your request (e.g., obtaining quotations)',
              'enter into an insurance arrangement on your behalf',
              'fulfil regulatory obligations imposed on us as a licensed insurance broker',
              'support insurers in underwriting or evaluating your application',
            ],
            'contractual-requirements-list',
          )}
          <Text style={styles.paragraph}>
            If you choose not to provide the required Personal Data, we may be
            unable to deliver the Services you request or comply with our legal,
            regulatory, or contractual obligations.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Sources of Information</Text>
          <Text style={styles.paragraph}>
            We obtain Personal Data about you from a variety of sources,
            depending on how you interact with eSanad and the Services you use.
            These sources include, but are not limited to:
          </Text>

          <Text style={styles.boldText}>1. Direct Collection</Text>
          <Text style={styles.paragraph}>
            We collect Personal Data that you provide directly to us when you
            engage with eSanad or use our Services. This includes information
            submitted through:
          </Text>
          {renderList(
            [
              'our website, mobile applications, BOT, or any of our digital sales channels',
              'account creation or registration forms',
              'identity verification or security questions',
              'declarations, questionnaires, confirmations, applications, or insurance forms',
              'documents or information shared with us before, during, or after entering into a contractual or pre-contractual relationship',
            ],
            'direct-collection-list',
          )}
          <Text style={styles.paragraph}>
            This information may be provided through written, electronic, or
            verbal communications with eSanad.
          </Text>

          <Text style={styles.boldText}>2. Publicly Available Information</Text>
          <Text style={styles.paragraph}>
            We may collect Personal Data that is publicly available or
            accessible through public sources, such as government portals,
            regulatory databases, public directories, commercially available
            datasets, or any other lawful public source.
          </Text>

          <Text style={styles.boldText}>3. Third-Party Collection</Text>
          <Text style={styles.paragraph}>
            We may receive Personal Data about you from third parties,
            including:
          </Text>
          {renderList(
            [
              'authentication and identity-verification service providers',
              'background verification agencies',
              'licensed insurance companies',
              'reinsurers and reinsurance partners',
              'business partners, intermediaries, and vendor service providers',
              'national identification systems authorised in the UAE (including UAE PASS)',
              'law enforcement authorities, courts, and regulatory bodies',
            ],
            'third-party-collection-list',
          )}
          <Text style={styles.paragraph}>
            We typically receive such Personal Data to verify your identity,
            maintain accuracy, prevent fraud, or fulfil our obligations as a
            licensed insurance broker.
          </Text>

          <Text style={styles.boldText}>4. Automated Collection</Text>
          <Text style={styles.paragraph}>
            When you use our digital platforms, we may automatically collect
            certain information through tracking and analytics technologies,
            including:
          </Text>
          {renderList(
            [
              'cookies and similar tracking files',
              'web beacons or tags',
              'pixel tags',
              'device identifiers',
              'IP address and geolocation indicators',
              'browser type, version, and language settings',
              'device type and operating system details',
              'pages viewed, links clicked, navigation paths, time spent on pages, and actions taken on our website or applications',
            ],
            'automated-collection-list',
          )}
          <Text style={styles.paragraph}>
            This information helps us improve usability, personalize user
            experience, monitor usage patterns, maintain security, and detect
            fraudulent activity. For more information about cookies, refer to
            our Cookies Notice.
          </Text>

          <Text style={styles.boldText}>Accuracy of Your Personal Data</Text>
          <Text style={styles.paragraph}>
            You must notify us in writing if any Personal Data we hold about you
            is inaccurate, outdated, or incomplete. Providing incorrect or
            incomplete information may prevent us from delivering certain
            Services or fulfilling obligations.
          </Text>

          <Text style={styles.boldText}>Data Updates and Retention</Text>
          <Text style={styles.paragraph}>
            We retain your Personal Data only as long as necessary for the
            purposes collected, in compliance with UAE laws, CBUAE regulations,
            and legitimate business needs. After retention periods, data is
            securely deleted, anonymized, or destroyed.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Automated Processing</Text>
          <Text style={styles.paragraph}>
            We may use automated processing, including profiling. Where such
            decisions legally affect you, you have the right to object and
            request human review unless the processing is necessary for
            contractual, legal, or consented purposes.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            7. Disclosure of Information to Others
          </Text>
          <Text style={styles.paragraph}>
            We do not disclose your Personal Data except as permitted by law,
            for contractual purposes, or with your consent. This includes
            sharing with:
          </Text>
          {renderList(
            [
              'Licensed insurers, reinsurers, IT providers, cloud and digital partners, advisors, and auditors',
              'For marketing, with your consent',
              'Insurance reporting agencies and industry databases',
              'Contractual requirements with insurers',
              'Legal, regulatory, and compliance obligations',
              'Parties with your explicit consent',
            ],
            'disclosure-list',
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            8. Limited Access or Transfer Outside the UAE
          </Text>
          <Text style={styles.paragraph}>
            We may transfer your Personal Data outside the UAE only with
            appropriate safeguards (data transfer agreements, contractual
            protections, approved mechanisms, encryption, restricted access,
            secure hosting) in compliance with UAE laws.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            9. How We Protect and Secure Your Data
          </Text>
          {renderList(
            [
              'Encryption: Personal Data is encrypted in transit and at rest',
              'Access Controls: Data accessible only to authorized employees or approved third parties',
              'Network & Infrastructure Security: Firewalls, monitoring, cybersecurity controls',
              'Data Segregation & Secure Backup: Encrypted backups in UAE locations',
              'Employee Training & Governance: Regular training on data protection and confidentiality',
              'Incident Detection and Response: Procedures to manage and notify data breaches as required by law',
            ],
            'security-measures-list',
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            10. How Long We Retain Your Personal Data
          </Text>
          <Text style={styles.paragraph}>
            We retain your Personal Data only for as long as necessary to fulfil
            the purposes for which it was collected, as well as for any
            secondary purposes that are compatible with those original purposes
            and permitted under this Privacy Notice. Our retention practices are
            governed by legal, regulatory, and operational requirements
            applicable to insurance intermediaries in the UAE, including:
          </Text>
          {renderList(
            [
              'the UAE Personal Data Protection Law (PDPL)',
              'the Central Bank of the UAE (CBUAE) regulations',
              'insurance sector regulatory requirements',
              'statutory limitation periods for legal or contractual claims',
            ],
            'retention-laws-list',
          )}
          <Text style={styles.paragraph}>
            In practice, this means that we typically retain your Personal Data:
          </Text>
          {renderList(
            [
              'for the duration of your relationship with eSanad',
              'for an additional period thereafter, where required or permitted under applicable UAE laws, such as:',
              'regulatory audit requirements',
              'legal record-keeping obligations',
              'dispute resolution timelines',
              'compliance with statutory documentation rules',
            ],
            'retention-practice-list',
          )}
          <Text style={styles.paragraph}>
            Once the applicable retention period has expired, eSanad will take
            appropriate steps to ensure that your Personal Data is securely and
            permanently:
          </Text>
          {renderList(
            ['deleted', 'anonymized', 'destroyed'],
            'data-disposal-list',
          )}
          <Text style={styles.paragraph}>
            All actions will be carried out in accordance with UAE data
            protection laws, CBUAE requirements, and recognized industry best
            practices.
          </Text>
          <Text style={styles.paragraph}>
            We periodically review the Personal Data we hold to ensure it is not
            retained longer than necessary and that any ongoing retention
            remains justified under applicable laws.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>11. Your Rights</Text>
          <Text style={styles.paragraph}>
            Under the UAE Personal Data Protection Law (Federal Decree-Law No.
            45 of 2021), you have several important rights as a data subject.
            These rights give you meaningful control over how your Personal Data
            is collected, processed, stored, and used. Your rights include the
            following:
          </Text>
          {renderList(
            [
              'Right to Request Access: You have the right to request access to the Personal Data we hold about you, including information about how we process it.',
              'Right to Rectification: You may request the correction or completion of any inaccurate, incomplete, or outdated Personal Data we hold.',
              'Right to Erasure: You may request the deletion of your Personal Data where it is no longer necessary for the purposes collected, and there is no lawful basis allowing us to continue processing it.',
              'Right to Restrict Processing: You may request that we restrict or suspend processing in certain situations, including when the accuracy of the data is contested or processing is unlawful.',
              'Right to Object: You may object to processing on reasonable grounds, except where processing is necessary to perform a public task, we are exercising official authority, or processing serves legitimate interests unless overridden by your rights.',
              'Right to Receive Your Personal Data (Data Portability): You may request and receive the Personal Data you provided in a structured, commonly used, machine-readable format, where processing is based on your consent or a contract and carried out by automated means.',
              'Right to Object to Automated Decision-Making: You may request human review where automated decisions produce legal effects or significantly affect you.',
              'Right to Withdraw Consent: You may withdraw consent at any time. Withdrawal does not affect processing conducted before withdrawal.',
            ],
            'rights-list',
          )}

          <Text style={styles.boldText}>Exercising Your Rights</Text>
          <Text style={styles.paragraph}>
            To exercise your rights or seek clarification, contact us using the
            details at the end of this Notice.
          </Text>

          <Text style={styles.boldText}>Important Notes</Text>
          {renderList(
            [
              'These rights are not absolute. We may lawfully refuse requests where permitted under PDPL.',
              'Requests are usually free, but a reasonable fee may be charged for repetitive or manifestly unreasonable requests.',
              'We may verify your identity before processing a request to ensure your data is protected.',
              'Additional information may be requested to process requests efficiently.',
              'We aim to respond within one month; complex cases may take up to two months with notice of extension.',
            ],
            'rights-notes-list',
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            12. Modifications to this Privacy Notice
          </Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Notice from time to time to reflect
            changes in business practices, legal or regulatory requirements,
            technology, or operational needs. Revised versions will be published
            on our website and become effective as of the date stated in the
            updated Notice.
          </Text>
          <Text style={styles.paragraph}>
            Continuing to use our Services after the updated Notice is effective
            constitutes your acknowledgment and acceptance of the revised terms.
            We encourage you to review this Notice periodically. For material
            changes affecting your rights or data processing, we may provide
            additional notice as required under UAE law.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            13. Governing Law and Jurisdiction
          </Text>
          <Text style={styles.paragraph}>
            This Privacy Notice is governed by the laws of the United Arab
            Emirates. Any dispute arising from or in connection with this
            Notice—including questions regarding existence, validity,
            interpretation, or termination—shall be submitted to the UAE Courts.
          </Text>
          <Text style={styles.paragraph}>
            By using our Services, you and eSanad unconditionally agree to the
            exclusive jurisdiction of the UAE Courts for resolving such
            disputes.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            14. Questions About This Privacy Notice?
          </Text>
          <Text style={styles.paragraph}>
            For any questions about this Privacy Notice or your data protection
            rights, contact our Data Protection Officer (DPO):
          </Text>
          <Text style={styles.paragraph}>
            Email:{' '}
            <Text style={styles.link} onPress={openEmail}>
              hello@esanad.com
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            If you are dissatisfied with our response, you may lodge a complaint
            with the competent UAE data protection authority, or the authority
            in your jurisdiction where applicable, in accordance with applicable
            laws.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: verticalScale(16),
      gap: verticalScale(16),
      paddingBottom: verticalScale(50),
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: verticalScale(16),
    },
    sectionCard: {
      borderRadius: moderateScale(12),
      backgroundColor: theme.colors.cardBackground,
    },
    mainTitle: {
      fontSize: moderateScale(16),
      color: theme.colors.primary,
      marginBottom: verticalScale(12),
      fontFamily: 'Lato-Bold',
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      color: theme.colors.primary,
      fontFamily: 'Lato-Bold',
      marginBottom: verticalScale(12),
    },
    sectionSubtitle: {
      fontSize: moderateScale(14),
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: verticalScale(8),
      marginTop: verticalScale(16),
    },
    paragraph: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      fontFamily: 'Lato-Regular',
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(12),
    },
    boldText: {
      fontSize: moderateScale(14),
      fontFamily: 'Lato-Bold',
      color: theme.colors.text,
      marginBottom: verticalScale(8),
      marginTop: verticalScale(8),
    },
    listContainer: {
      marginLeft: moderateScale(8),
      marginBottom: verticalScale(12),
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: verticalScale(4),
    },
    bullet: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      marginRight: moderateScale(8),
      lineHeight: moderateScale(20),
    },
    listText: {
      fontSize: moderateScale(14),
      color: theme.colors.description,
      lineHeight: moderateScale(20),
      flex: 1,
    },
    sectionItem: {
      marginBottom: verticalScale(16),
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
  });

export default PrivacyPolicy;
