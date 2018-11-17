module.exports = [
  // full name
  {
    type: "text",
    text: "まずはじめにお名前を教えて下さい"
  },
  // name of university
  {
    type: "text",
    text: "次に大学名、学部、学年を教えてください\n例)○○大学/○○学部/○年"
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
          "label": "2019年卒業",
          "text": "2019年卒業"
        },
        {
          "type": "message",
          "label": "2020年卒業",
          "text": "2020年卒業"
        },
        {
          "type": "message",
          "label": "2021年以降卒業",
          "text": "2021年以降卒業"
        },
        {
          "type": "message",
          "label": "卒業済既卒",
          "text": "卒業済既卒"
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
    text: "次に電話番号を教えて下さい！"
  },
  [
    // agreement file
    {
      "type": "text",
      "text": "https://goo.gl/qp7H2K"
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
      text: "最後に参加したい日程を選択して下さい！\n(火・水曜日の２日間分は無料です。追加の宿泊は一律¥2,000/泊でご利用できます。)"
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
            "title": "<参加クールが決まっていない場合>",
            "text": "参加希望\"月\"のみ決まっている場合は「希望月」を、決まっていない場合は「未定」をお選びください。",
            "actions": [
              {
                "type": "message",
                "label": "11月",
                "text": "11月"
              },
              {
                "type": "message",
                "label": "12月",
                "text": "12月"
              },
              {
                "type": "message",
                "label": "決まっていない",
                "text": "決まってない"
              }
            ]
          },
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
                "label": "＋前泊",
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