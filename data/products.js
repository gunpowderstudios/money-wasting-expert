/*
 * Money Wasting Expert: product data. Edit this file, not index.html.
 *
 * featured[]   Products that PASS the ratings test (50+ ratings, 1-2 star beat 4-5 star by 10%+ of all ratings).
 *              Needs the five raw counts in 1-star..5-star order ("whole"), the total, a source URL and
 *              a "checked" date (YYYY-MM-DD) for when you read the counts off the retailer page.
 * nearMisses[] Same shape. For products where low ratings beat high ratings but the sample is small or the margin is thin.
 *              The shelf stays hidden until there is at least one entry.
 * audit[]      Products that were looked at and did NOT pass, kept so the site can show its working.
 *
 * To add a product: read the five star counts off the retailer page, copy an existing entry, and change the values.
 * The search box on the site matches product names in featured[], nearMisses[] and audit[].
 * Never enter percentages as counts, and never guess a count.
 */
const MWE_DATA = {
 "cases": [
  {
   "id": "lefant",
   "name": "Lefant M210",
   "category": "Product tests",
   "badge": "Lab test",
   "tone": "test",
   "label": "Robot vacuum · model-specific test",
   "summary": "Consumer Reports placed the M210 among its worst tested vacuums and singled out its cleaning performance. Check the exact model before comparing it with other Lefant vacuums.",
   "angle": "A robot that can find its way around the furniture still has to find the dirt.",
   "sources": [
    [
     "Consumer Reports",
     "Lab-test roundup",
     "https://www.consumerreports.org/appliances/vacuum-cleaners/worst-vacuums-we-tested-and-what-to-buy-instead-a4744433209/"
    ]
   ]
  },
  {
   "id": "rabbit",
   "name": "Rabbit R1",
   "category": "Launch reviews",
   "badge": "Launch review",
   "label": "Pocket AI assistant · 2024 launch",
   "summary": "The Verge’s launch test found the assistant often got things wrong and lacked everyday smartphone features. The company later acknowledged problems with the early experience.",
   "angle": "A bright orange answer to the question nobody asked their phone.",
   "sources": [
    [
     "The Verge",
     "Hands-on video review",
     "https://www.youtube.com/watch?v=DVJL6LXgOE4"
    ],
    [
     "WIRED",
     "Independent hands-on review",
     "https://www.wired.com/review/rabbit-r1/"
    ],
    [
     "The Verge",
     "Later company response",
     "https://www.theverge.com/news/671955/jony-ive-rabbit-r1-humane-ai-pin"
    ]
   ]
  },
  {
   "id": "humane",
   "name": "Humane Ai Pin",
   "category": "Launch reviews",
   "badge": "Launch review",
   "label": "Wearable AI · 2024 launch",
   "summary": "WIRED scored the launch model 4/10, citing limited features, slow answers and a palm projector that was hard to see in daylight.",
   "angle": "Finally, a screen you can take outside but can’t read outside.",
   "sources": [
    [
     "WIRED",
     "Hands-on review, 4/10",
     "https://www.wired.com/review/humane-ai-pin/"
    ],
    [
     "TechRadar",
     "Round-up of launch reviews",
     "https://www.techradar.com/computing/artificial-intelligence/humane-ai-pin-review-roundup"
    ]
   ]
  },
  {
   "id": "juicero",
   "name": "Juicero Press",
   "category": "Discontinued",
   "badge": "Archive flop",
   "label": "Connected juice press · discontinued",
   "summary": "Ars Technica reported the company shut down after scrutiny over a press whose proprietary juice bags could also be squeezed by hand.",
   "angle": "The most inconvenient way to replace your hands.",
   "sources": [
    [
     "Ars Technica",
     "Shutdown and product reporting",
     "https://arstechnica.com/information-technology/2017/09/juicero-maker-of-proprietary-juice-bag-presser-is-shutting-down/"
    ],
    [
     "Ars Technica",
     "Hardware teardown coverage",
     "https://arstechnica.com/information-technology/2017/04/juicero-teardown-hints-at-a-very-expensively-built-product/"
    ]
   ]
  },
  {
   "id": "keurig",
   "name": "Keurig Kold",
   "category": "Discontinued",
   "badge": "Archive flop",
   "label": "Pod-based fizzy drinks · discontinued",
   "summary": "WIRED scored the countertop soda machine 4/10. The brewer used proprietary pods, and Engadget reported the product was discontinued in under a year.",
   "angle": "What if a can of pop needed its own appliance?",
   "sources": [
    [
     "WIRED",
     "Hands-on review, 4/10",
     "https://www.wired.com/2015/10/review-keurig-kold/"
    ],
    [
     "Engadget",
     "Discontinuation reporting",
     "https://www.engadget.com/2016-06-07-keurig-kold-goes-flat.html"
    ]
   ]
  },
  {
   "id": "hutzler",
   "name": "Hutzler 571 Banana Slicer",
   "category": "Review parody",
   "badge": "Parody, not proof",
   "tone": "satire",
   "label": "Novelty kitchen gadget · spoof reviews",
   "summary": "Shoppers made an online comedy routine out of a utensil for slicing bananas. The joke reviews aren’t evidence that it cuts badly.",
   "angle": "The product that outsourced its marketing to comedians in the reviews section.",
   "sources": [
    [
     "Laughing Squid",
     "Examples of satirical customer posts",
     "https://laughingsquid.com/funny-amazon-reviews-for-the-hutzler-571-banana-slicer/"
    ],
    [
     "Know Your Meme",
     "Parody context",
     "https://knowyourmeme.com/memes/banana-slicer-reviews"
    ]
   ]
  }
 ],
 "photos": {
  "review-frying-pan": [
   "https://media.4rgos.it/i/Argos/3084841_R_Z001A?w=480",
   "Argos",
   "https://www.argos.co.uk/product/3084841"
  ],
  "review-cookworks": [
   "https://media.4rgos.it/i/Argos/9339325_R_Z003A?w=480",
   "Argos",
   "https://www.argos.co.uk/product/9339325"
  ],
  "review-breville": [
   "https://media.4rgos.it/s/Argos/7839425_R_SET?%24Main768%24=&h=480&w=480",
   "Argos",
   "https://www.argos.co.uk/product/7839425"
  ],
  "review-shark": [
   "https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-EU/RV2900XEUK_01.jpg",
   "Shark",
   "https://www.sharkninja.co.uk/shark-thermacharged-powerdetect-wet-dry-robot-vacuum/RV2900XEUK.html"
  ],
  "review-giles": [
   "https://media.4rgos.it/i/Argos/2997788_R_Z010A?w=480",
   "Argos",
   "https://www.argos.co.uk/product/2997788"
  ],
  "review-salter": [
   "https://media.4rgos.it/s/Argos/3030675_R_SET?w=480",
   "Argos",
   "https://www.argos.co.uk/product/3030675"
  ],
  "review-tefal": [
   "https://media.currys.biz/i/currysprod/10226559?w=480",
   "Currys",
   "https://www.currys.co.uk/products/tefal-includeo-tt533840-2slice-toaster-black-10226559.html"
  ],
  "review-fellowes": [
   "https://cdn.images.fecom-media.com/FE00059131/images/41711016_q7i3RDsUE.jpg?q=75&w=480",
   "Findel International",
   "https://www.findel-international.com/product/fe00059131"
  ],
  "review-jml": [
   "https://media.very.co.uk/i/very/NF062_SQ1_0000000099_N-A_SLf1?%24pdp_300x400_x2%24=&fmt=jpg",
   "Very",
   "https://www.very.co.uk/jml-hands-free-can-opener-electric-tin-opener/639559907.prd"
  ],
  "review-tower": [
   "https://www.robertdyas.co.uk/media/catalog/product/t/1/t17102_1.jpg?height=480&width=480",
   "Robert Dyas",
   "https://www.robertdyas.co.uk/tower-vortx-vizion-11l-dual-air-fryer"
  ],
  "review-bush": [
   "https://media.4rgos.it/s/Argos/7271090_R_SET?%24Main768%24=&h=480&w=480",
   "Argos",
   "https://www.argos.co.uk/product/7271090"
  ],
  "lefant": [
   "https://img06.weeecdn.com/item/image/013/654/187B08FEFFED2474.jpeg",
   "Weee!",
   "https://www.sayweee.com/en/product/Lefant-Robot-Vacuum-Cleaner-Strong-Suction/2833771"
  ],
  "rabbit": [
   "https://www.rabbit.tech/_next/image?q=75&url=%2Fnewsroom%2Fnewsroom_assets_introducingR1.png&w=1920",
   "Rabbit newsroom",
   "https://www.rabbit.tech/newsroom"
  ],
  "humane": [
   "https://www.red-dot.org/fileadmin/user_upload/61-09589-2024PD.1119158_CO.jpg",
   "Red Dot",
   "https://www.red-dot.org/project/ai-pin-72307"
  ],
  "juicero": [
   "https://www.domusweb.it/content/dam/domusweb/en/news/2016/07/01/yves_behar_juicero/domus_10_Juicero.jpg.foto.rmedium.jpg",
   "Domus",
   "https://www.domusweb.it/en/news/2016/07/01/yves_behar_juicero.html"
  ],
  "keurig": [
   "https://media.wired.com/photos/5955bd2e3ff99d6b3a1d159c/master/w_480%2Cc_limit/keurigkold1.jpg",
   "WIRED",
   "https://www.wired.com/2015/09/keurig-kold-soda-machine/"
  ],
  "hutzler": [
   "https://cdn11.bigcommerce.com/s-jtxa13/images/stencil/640w/products/2106/4981/571_150dpi_8x5__20698.1752154237.jpg?c=2",
   "Hutzler",
   "https://hutzlerco.com/hutzler-banana-slicer-oanz/"
  ]
 },
 "featured": [
  {
   "id": "review-frying-pan",
   "name": "Home Essentials 30cm Non Stick Carbon Steel Frying Pan",
   "stars": 1,
   "whole": [
    37,
    4,
    7,
    5,
    26
   ],
   "total": 79,
   "mode": "count",
   "source": "Argos",
   "checked": null,
   "reviewDate": "18 May 2026",
   "snippet": "…as soon as it started to warm up the centre popped out and became convex",
   "tip": "Check for repeated reports of sticking or warping before replacing a pan that still works.",
   "reviewNote": "Sticking came up in multiple low-star reviews. Some other customers reported that the pan worked well for them.",
   "productUrl": "https://www.argos.co.uk/product/3084841",
   "sources": [
    [
     "Argos rating breakdown and customer reviews",
     "Quoted review · 18 May 2026",
     "https://www.argos.co.uk/product/3084841/#reviews"
    ]
   ]
  }
 ],
 "nearMisses": [],
 "audit": [
  {
   "id": "cookworks",
   "name": "Cookworks 2 Portion Sandwich Toaster",
   "stars": 2,
   "reviewDate": "5 September 2026",
   "sku": "9339325",
   "whole": [
    141,
    55,
    135,
    284,
    841
   ]
  },
  {
   "id": "breville",
   "name": "Breville Prima Latte OneTouch Espresso Machine",
   "stars": 2,
   "reviewDate": "18 June 2026",
   "sku": "7839425",
   "whole": [
    0,
    1,
    3,
    3,
    19
   ]
  },
  {
   "id": "shark",
   "name": "Shark ThermaCharged PowerDetect Robot Vacuum",
   "stars": 2,
   "reviewDate": "25 July 2026",
   "sku": "7939040",
   "whole": [
    2,
    2,
    1,
    1,
    13
   ],
   "origin": "Originally posted on Shark’s site"
  },
  {
   "id": "giles",
   "name": "Giles & Posner Mini Popcorn Maker",
   "stars": 1,
   "reviewDate": "8 July 2026",
   "sku": "2997788",
   "whole": [
    7,
    0,
    1,
    1,
    6
   ]
  },
  {
   "id": "salter",
   "name": "Salter Kuro XL 3-in-1 Snack Maker",
   "stars": 1,
   "reviewDate": "7 April 2026",
   "sku": "3030675",
   "whole": [
    1,
    0,
    2,
    4,
    9
   ]
  },
  {
   "id": "tefal",
   "name": "Tefal Includeo TT533840 2 Slice Toaster",
   "stars": 1,
   "reviewDate": "15 June 2026",
   "sku": "7669413",
   "whole": [
    6,
    1,
    8,
    16,
    52
   ],
   "origin": "Originally posted on Tefal’s site"
  },
  {
   "id": "fellowes",
   "name": "Fellowes PowerShred LX25",
   "stars": 1,
   "reviewDate": "20 August 2026",
   "sku": "3378708",
   "whole": [
    14,
    0,
    8,
    25,
    73
   ]
  },
  {
   "id": "jml",
   "name": "JML Hands Free Automatic Can Opener",
   "stars": 1,
   "reviewDate": "12 April 2026",
   "sku": "7671755",
   "whole": [
    12,
    3,
    6,
    14,
    37
   ]
  },
  {
   "id": "tower",
   "name": "Tower Vortx Vizion T17102 Air Fryer Oven",
   "stars": 2,
   "reviewDate": "22 September 2026",
   "sku": "1231311",
   "whole": [
    15,
    11,
    27,
    78,
    426
   ]
  },
  {
   "id": "bush",
   "name": "Bush Chrome Desk Fan, 12 Inch",
   "stars": 2,
   "reviewDate": "17 July 2026",
   "sku": "7271090",
   "whole": [
    16,
    8,
    19,
    58,
    210
   ]
  }
 ],
 "whatsNew": [
  {
   "version": "v0.3.0",
   "title": "One search box",
   "items": [
    "The “Check a product” paste box is gone. One search box at the top now covers any product.",
    "Search shows anything we’ve tested (with its 1–2★ v 4–5★ counts), plus links to search Amazon UK and Argos, and discussion leads.",
    "If we haven’t tested a product, the page says so instead of guessing."
   ]
  },
  {
   "version": "v0.2.0",
   "title": "Clearer rules, tidier site",
   "items": [
    "The front-page test now needs low ratings to beat high ratings by at least 10% of all ratings, so a 51–49 split no longer counts as “worst”.",
    "Featured cards show when the ratings were checked. Snapshots without a recorded date say so.",
    "The checker can now produce a ready-to-paste data entry for any product you check.",
    "The hero line now says what the shelf is. The old ten audited picks are listed with their counts.",
    "Ratings logic is tested in the repo (npm test), and product data lives in data/products.js."
   ]
  },
  {
   "version": "v0.1.12",
   "title": "Ratings evidence and Amazon UK checking",
   "items": [
    "Front page only features products with sourced counts for all five star buckets and at least 50 ratings.",
    "Added the ratings checker and Amazon UK percentage handling."
   ]
  }
 ]
};
if (typeof module !== "undefined") module.exports = MWE_DATA;
