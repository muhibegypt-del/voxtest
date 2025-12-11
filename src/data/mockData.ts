export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  image_url: string;
  category: string;
  content_type: string;
  subcategory?: string;
  region?: string;
  author_name: string;
  published: boolean;
  featured: boolean;
  featured_priority: number;
  view_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Investigative Journalism Uncovers Major Corporate Scandal: The Hidden Cost of Deregulation',
    slug: 'investigative-journalism-uncovers-major-corporate-scandal',
    body: 'An in-depth investigation reveals systematic failures in regulatory oversight, exposing how powerful interests operate beyond public accountability. This bombshell report details the multi-year cover-up and its devastating global impact.\n\nThe investigation began when whistleblowers came forward with internal documents showing a pattern of regulatory capture that spans multiple industries. These documents reveal how corporate lobbyists have systematically undermined oversight mechanisms, creating an environment where public safety takes a backseat to private profit.\n\nKey findings include evidence of revolving door relationships between regulators and industry executives, undisclosed conflicts of interest, and the deliberate suppression of safety studies that could have prevented numerous public health crises.\n\nThe implications of these findings extend far beyond any single company or industry. They point to a fundamental breakdown in the systems designed to protect the public interest, raising serious questions about the effectiveness of current regulatory frameworks in an era of increasing corporate consolidation.',
    excerpt: 'An in-depth investigation reveals systematic failures in regulatory oversight, exposing how powerful interests operate beyond public accountability.',
    image_url: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'News',
    content_type: 'Analysis',
    region: 'global',
    author_name: 'Sarah Mitchell',
    published: true,
    featured: true,
    featured_priority: 10,
    view_count: 15420,
    tags: ['investigation', 'corporate-accountability', 'regulation'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Media Narrative Challenged by New Evidence on Foreign Influence Operations',
    slug: 'media-narrative-challenged-by-new-evidence-on-foreign-influence',
    body: 'Documents obtained through freedom of information requests contradict widely reported claims by major outlets, raising serious questions about source credibility and editorial independence in covering international conflicts.\n\nThe newly released documents show a significant disconnect between official government assessments and the narratives promoted in mainstream media coverage. This discrepancy suggests either a failure in journalistic due diligence or the influence of undisclosed sources with their own agendas.\n\nAnalysis of the documents reveals that key claims made in dozens of news reports cannot be substantiated by the available evidence. In some cases, the evidence directly contradicts the reported narrative, yet these contradictions were never acknowledged or corrected by the outlets involved.\n\nThis pattern raises fundamental questions about the independence of news organizations and their relationship with government and intelligence sources. The implications for public understanding of critical international issues are profound.',
    excerpt: 'Documents obtained through freedom of information requests contradict widely reported claims by major outlets, raising serious questions about source credibility.',
    image_url: 'https://images.pexels.com/photos/8828597/pexels-photo-8828597.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Politics',
    content_type: 'News',
    region: 'united-states',
    author_name: 'Michael Chen',
    published: true,
    featured: true,
    featured_priority: 9,
    view_count: 12890,
    tags: ['media-analysis', 'foreign-policy', 'journalism'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    title: 'Silicon Valley Giants Quietly Lobby Against Privacy Legislation',
    slug: 'silicon-valley-giants-quietly-lobby-against-privacy-legislation',
    body: 'Internal documents reveal coordinated efforts by major technology companies to weaken proposed privacy protections through strategic lobbying and public relations campaigns.\n\nThe documents, obtained through a combination of leaked materials and public records requests, show how tech giants have spent millions of dollars to influence lawmakers and shape public opinion on privacy legislation. The campaign involves sophisticated messaging strategies designed to frame privacy protections as threats to innovation and economic growth.\n\nParticularly concerning is evidence of coordination between companies that publicly compete with each other but privately work together to oppose regulatory measures. This coordination extends to funding think tanks and academic research that supports their position while obscuring the source of funding.\n\nThe revelations come at a critical time as lawmakers consider comprehensive privacy legislation that could fundamentally change how personal data is collected and used by technology companies.',
    excerpt: 'Internal documents reveal coordinated efforts by major technology companies to weaken proposed privacy protections through strategic lobbying.',
    image_url: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Technology',
    content_type: 'Feature',
    region: 'united-states',
    author_name: 'Elena Rodriguez',
    published: true,
    featured: false,
    featured_priority: 0,
    view_count: 8750,
    tags: ['privacy', 'big-tech', 'lobbying'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '4',
    title: 'Hidden Trade Agreement Details Emerge Despite Official Secrecy',
    slug: 'hidden-trade-agreement-details-emerge-despite-official-secrecy',
    body: 'Leaked negotiation documents reveal provisions in upcoming trade agreements that could significantly impact labor rights, environmental protections, and national sovereignty.\n\nThe documents, which negotiators intended to keep secret until after ratification, contain numerous provisions that appear to prioritize corporate interests over public welfare. Of particular concern are investor-state dispute settlement mechanisms that could allow corporations to sue governments for policies that affect their profits.\n\nEnvironmental groups have expressed alarm at provisions that could weaken existing environmental protections and make it difficult for countries to implement stronger climate policies. Labor organizations are similarly concerned about provisions that could undermine worker protections and collective bargaining rights.\n\nThe secrecy surrounding these negotiations has drawn criticism from transparency advocates who argue that agreements with such far-reaching implications should be subject to public scrutiny before ratification.',
    excerpt: 'Leaked negotiation documents reveal provisions in upcoming trade agreements that could significantly impact labor rights and environmental protections.',
    image_url: 'https://images.pexels.com/photos/6077447/pexels-photo-6077447.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Business',
    content_type: 'News',
    region: 'global',
    author_name: 'David Kim',
    published: true,
    featured: false,
    featured_priority: 0,
    view_count: 6420,
    tags: ['trade', 'transparency', 'corporate-power'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '5',
    title: 'Athletic Doping Scandal Reveals Systematic Cover-up by Sports Officials',
    slug: 'athletic-doping-scandal-reveals-systematic-cover-up',
    body: 'Investigation uncovers evidence that sports governing bodies knowingly ignored positive drug tests and suppressed evidence of widespread performance-enhancing drug use.\n\nThe investigation, based on testimony from former officials and leaked internal communications, reveals a culture of willful blindness within major sports organizations. Officials appear to have prioritized protecting the commercial value of their sports over maintaining competitive integrity.\n\nParticularly damaging are communications showing that officials were aware of systematic doping programs but chose not to investigate or report them to anti-doping authorities. In some cases, officials actively worked to suppress evidence and intimidate potential whistleblowers.\n\nThe scandal has implications that extend far beyond sports, raising questions about the integrity of institutions that claim to uphold fair play and ethical competition. It also highlights the corrupting influence of commercial interests on organizations that are supposed to serve the public good.',
    excerpt: 'Investigation uncovers evidence that sports governing bodies knowingly ignored positive drug tests and suppressed evidence of widespread doping.',
    image_url: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Sports',
    content_type: 'Analysis',
    region: 'global',
    author_name: 'Jessica Thompson',
    published: true,
    featured: false,
    featured_priority: 0,
    view_count: 9340,
    tags: ['sports', 'corruption', 'doping'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: '6',
    title: 'Hollywood Contracts Include Unprecedented Speech Restrictions',
    slug: 'hollywood-contracts-include-unprecedented-speech-restrictions',
    body: 'Analysis of entertainment industry contracts reveals clauses that severely limit actors\' and creators\' ability to speak publicly about social and political issues.\n\nThe contracts, obtained through industry sources, contain morality clauses and speech restrictions that go far beyond traditional confidentiality agreements. These provisions appear designed to prevent talent from expressing views that might be considered controversial or that could affect the commercial prospects of their projects.\n\nLegal experts describe these restrictions as unprecedented in their scope and potentially unconstitutional. The clauses cover not just public statements but also social media activity and even private associations that might become public knowledge.\n\nThe restrictions come at a time when many in the entertainment industry have become more politically active, suggesting a coordinated effort by studios and production companies to limit their talent\'s public engagement with important social issues.',
    excerpt: 'Analysis of entertainment industry contracts reveals clauses that severely limit actors\' ability to speak publicly about social and political issues.',
    image_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Entertainment',
    content_type: 'Feature',
    region: 'united-states',
    author_name: 'Alex Rivera',
    published: true,
    featured: false,
    featured_priority: 0,
    view_count: 7680,
    tags: ['hollywood', 'free-speech', 'contracts'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '7',
    title: 'Think Tank Independence Questioned After Funding Revelations',
    slug: 'think-tank-independence-questioned-after-funding-revelations',
    body: 'Financial records reveal that prominent policy research organizations receive significant funding from corporations and foreign governments while presenting themselves as independent.\n\nThe records, compiled from tax filings and donor disclosures, show a pattern of undisclosed conflicts of interest that call into question the objectivity of influential policy research. Many think tanks that regularly provide expert commentary to media outlets receive substantial funding from entities with direct interests in the policies they analyze.\n\nParticularly concerning is evidence that some organizations have tailored their research agendas to align with donor interests, effectively functioning as lobbying organizations while maintaining the appearance of academic independence.\n\nThe revelations have prompted calls for greater transparency in think tank funding and clearer disclosure requirements for organizations that seek to influence public policy through research and media engagement.',
    excerpt: 'Financial records reveal that prominent policy research organizations receive significant funding from corporations while presenting themselves as independent.',
    image_url: 'https://images.pexels.com/photos/8828583/pexels-photo-8828583.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Politics',
    content_type: 'Opinion',
    region: 'united-states',
    author_name: 'Robert Martinez',
    published: true,
    featured: false,
    featured_priority: 0,
    view_count: 5920,
    tags: ['think-tanks', 'transparency', 'influence'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: '8',
    title: 'Cybersecurity Vulnerabilities Deliberately Left Unpatched for Surveillance',
    slug: 'cybersecurity-vulnerabilities-deliberately-left-unpatched',
    body: 'Internal documents from major technology companies reveal that known security vulnerabilities were left unpatched to facilitate government surveillance programs.\n\nThe documents show a troubling pattern of cooperation between tech companies and intelligence agencies that prioritizes surveillance capabilities over user security. In several documented cases, companies delayed or avoided fixing security flaws that could have been exploited by malicious actors.\n\nSecurity researchers have long suspected such arrangements, but the documents provide concrete evidence of the practice. The revelations raise serious questions about the security of digital infrastructure and the trustworthiness of major technology platforms.\n\nThe practice appears to violate the companies\' own stated commitments to user privacy and security, suggesting that public statements about protecting user data may not reflect actual corporate priorities when government pressure is applied.',
    excerpt: 'Internal documents reveal that known security vulnerabilities were left unpatched to facilitate government surveillance programs.',
    image_url: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Technology',
    content_type: 'News',
    region: 'global',
    author_name: 'Lisa Chang',
    published: true,
    featured: false,
    featured_priority: 0,
    view_count: 11250,
    tags: ['cybersecurity', 'surveillance', 'privacy'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  }
];

export const FEATURED_ARTICLES = ARTICLES.filter(article => article.featured);
export const LATEST_ARTICLES = ARTICLES.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());