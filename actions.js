module.exports = [
  // full name
  {
    type: "text",
    text: "まずはじめにお名前を教えて下さい"
  },
  // name of university
  {
    type: "text",
    text: "次に大学名、学部、学年を教えてください\n例)○○大学/○○宿学部/○年"
  },
  //date of graduation
  {
    "type": "template",
    "altText": "graduation date",
    "template": {
        "type": "buttons",
        "text": "ご登録ありがとうございます。初回登録にあたり卒業年度を下から選んでください。",
        "title": "卒業年度の選択",
        "actions": [
            {
              "type": "message",
              "label":"2019年卒業",
              "text":"2019年卒業"
            },
            {
              "type": "message",
              "label":"2020年卒業",
              "text":"2020年卒業"
            },
            {
              "type":"message",
              "label":"2021年以降卒業",
              "text":"2021年以降卒業"
            },
            {
              "type":"message",
              "label":"卒業済既卒",
              "text":"卒業済既卒"
            }
        ]
    }
  },
  // email
  {
    type: "text",
    text: "これで半分終わりました！\n次にメールアドレスを教えて下さい"
  },
  // phone
  {
    type: "text",
    text: "次に電話番号を教えて下さい！\n"
  },
  [
    // agreement file
    {
      "type": "text",
      "text": "https://files.fm/u/grqekbcb#/view/%E8%A6%8F%E7%B4%84.pdf"
    },
    // agreement
    {
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
        "type": "buttons",
        "actions": [
          {
            "type": "message",
            "label": "同意する",
            "text": "同意する"
          }
        ],
        "title": "規約への同意",
        "text": "上記の規約を確認の上、同意していただけますか？"
      }
    }
  ],
  [
    // before plans
    {
    type: "text",
    text: "最後に参加したい日程を選択して下さい！\n(一律¥2,000/泊で前泊・延泊出来ます)\n"
    },
    // plans
    {
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
        "type": "carousel",
        "actions": [],
        "columns": [
          {
            "title": "<第３クール>",
            "text": "参加したいプランをお選びください",
            "actions": [
              {
                "type": "message",
                "label": "11/20(火)~22(木)のみ",
                "text": "第３クール"
              },
              {
                "type": "message",
                "label": "＋前泊\b",
                "text": "第3クール(前泊)"
              },
              {
                "type": "message",
                "label": "＋延泊",
                "text": "第３クール(延泊)"
              }
            ]
          },
          {
            "title": "<第４クール>",
            "text": "参加したいプランをお選びください",
            "actions": [
              {
                "type": "message",
                "label": "11/27(火)~29(木)のみ",
                "text": "第４クール"
              },
              {
                "type": "message",
                "label": "＋前泊",
                "text": "第４クール(前泊)"
              },
              {
                "type": "message",
                "label": "＋延泊",
                "text": "第４クール(延泊)"
              }
            ]
          },
          {
            "title": "<第５クール>",
            "text": "参加したいプランをお選びください",
            "actions": [
              {
                "type": "message",
                "label": "12/4(火)~6(木)のみ",
                "text": "第５クール"
              },
              {
                "type": "message",
                "label": "＋前泊",
                "text": "第５クール(前泊)"
              },
              {
                "type": "message",
                "label": "＋延泊",
                "text": "第５クール(延泊)"
              }
            ]
          },
          {
            "title": "<第６クール>",
            "text": "参加したいプランをお選びください",
            "actions": [
              {
                "type": "message",
                "label": "12/11(火)~13(木)のみ",
                "text": "第６クール"
              },
              {
                "type": "message",
                "label": "＋前泊",
                "text": "第６クール(前泊)"
              },
              {
                "type": "message",
                "label": "＋延泊",
                "text": "第６クール(延泊)"
              }
            ]
          },
          {
            "title": "<第７クール>",
            "text": "参加したいプランをお選びください",
            "actions": [
              {
                "type": "message",
                "label": "12/18(火)~20(木)のみ",
                "text": "第７クール"
              },
              {
                "type": "message",
                "label": "＋前泊",
                "text": "第７クール(前泊)"
              },
              {
                "type": "message",
                "label": "＋延泊",
                "text": "第７クール(延泊)"
              }
            ]
          }
        ]
      }
    }
  ]
]