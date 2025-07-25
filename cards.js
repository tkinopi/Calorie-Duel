const CARDS = {
    food: [
        {
            id: 'rice',
            name: 'ご飯',
            type: 'food',
            calories: 250,
            nutrients: { carbs: 55, protein: 4, fat: 1 },
            effect: '基本の主食。安定したエネルギー源',
            rarity: 'common'
        },
        {
            id: 'hamburger',
            name: 'ハンバーガー',
            type: 'food',
            calories: 520,
            nutrients: { carbs: 35, protein: 25, fat: 30 },
            effect: '高カロリー！次のターン、相手も+100kcal',
            rarity: 'rare',
            specialEffect: 'opponent_calories_boost'
        },
        {
            id: 'salad',
            name: 'サラダ',
            type: 'food',
            calories: 80,
            nutrients: { carbs: 8, protein: 3, fat: 4 },
            effect: '低カロリー。次の食事カードの効果-50kcal',
            rarity: 'common',
            specialEffect: 'next_food_reduction'
        },
        {
            id: 'pizza',
            name: 'ピザ',
            type: 'food',
            calories: 600,
            nutrients: { carbs: 40, protein: 20, fat: 35 },
            effect: '超高カロリー！でも美味しい',
            rarity: 'rare'
        },
        {
            id: 'apple',
            name: 'りんご',
            type: 'food',
            calories: 80,
            nutrients: { carbs: 20, protein: 0, fat: 0 },
            effect: '健康的なおやつ。体調メーター上限+50',
            rarity: 'common',
            specialEffect: 'health_boost'
        },
        {
            id: 'chicken',
            name: '鶏胸肉',
            type: 'food',
            calories: 190,
            nutrients: { carbs: 0, protein: 35, fat: 4 },
            effect: '高タンパク。次の運動カードの効果+20%',
            rarity: 'uncommon',
            specialEffect: 'exercise_boost'
        },
        {
            id: 'pasta',
            name: 'パスタ',
            type: 'food',
            calories: 350,
            nutrients: { carbs: 70, protein: 12, fat: 2 },
            effect: '炭水化物でエネルギー満タン',
            rarity: 'common'
        },
        {
            id: 'icecream',
            name: 'アイスクリーム',
            type: 'food',
            calories: 280,
            nutrients: { carbs: 25, protein: 4, fat: 18 },
            effect: '甘い誘惑。相手の次のカード選択を混乱させる',
            rarity: 'uncommon',
            specialEffect: 'opponent_confusion'
        }
    ],
    
    exercise: [
        {
            id: 'walking',
            name: 'ウォーキング',
            type: 'exercise',
            calories: -150,
            effect: '軽い有酸素運動。安全にカロリー消費',
            rarity: 'common'
        },
        {
            id: 'running',
            name: 'ジョギング',
            type: 'exercise',
            calories: -300,
            effect: '中程度の有酸素運動。しっかりカロリー消費',
            rarity: 'common'
        },
        {
            id: 'swimming',
            name: '水泳',
            type: 'exercise',
            calories: -400,
            effect: '全身運動。大幅カロリー消費',
            rarity: 'uncommon'
        },
        {
            id: 'weightlifting',
            name: '筋力トレーニング',
            type: 'exercise',
            calories: -200,
            effect: '筋トレ。基礎代謝+10（永続）',
            rarity: 'uncommon',
            specialEffect: 'metabolism_boost'
        },
        {
            id: 'yoga',
            name: 'ヨガ',
            type: 'exercise',
            calories: -100,
            effect: 'リラックス効果。ストレス系イベント無効化',
            rarity: 'common',
            specialEffect: 'stress_immunity'
        },
        {
            id: 'hiit',
            name: 'HIIT',
            type: 'exercise',
            calories: -500,
            effect: '高強度インターバル！大量消費だが疲労蓄積',
            rarity: 'rare',
            specialEffect: 'fatigue_accumulation'
        },
        {
            id: 'dancing',
            name: 'ダンス',
            type: 'exercise',
            calories: -250,
            effect: '楽しく運動。相手も一緒に踊らせる（-100kcal）',
            rarity: 'uncommon',
            specialEffect: 'opponent_exercise'
        }
    ],
    
    event: [
        {
            id: 'party',
            name: '飲み会',
            type: 'event',
            calories: 800,
            effect: '避けられない誘惑！両プレイヤー+800kcal',
            rarity: 'rare',
            specialEffect: 'both_players_calories'
        },
        {
            id: 'stress',
            name: 'ストレス',
            type: 'event',
            calories: 0,
            effect: '次の食事カードのカロリー+50%',
            rarity: 'common',
            specialEffect: 'food_calories_increase'
        },
        {
            id: 'sleep_deprivation',
            name: '睡眠不足',
            type: 'event',
            calories: 0,
            effect: '基礎代謝-20、運動効果半減（3ターン）',
            rarity: 'uncommon',
            specialEffect: 'metabolism_penalty'
        },
        {
            id: 'health_checkup',
            name: '健康診断',
            type: 'event',
            calories: 0,
            effect: '体調メーターを理想値に近づける',
            rarity: 'rare',
            specialEffect: 'health_normalize'
        },
        {
            id: 'food_poisoning',
            name: '食中毒',
            type: 'event',
            calories: -200,
            effect: '体調不良。次のターンカードプレイ不可',
            rarity: 'uncommon',
            specialEffect: 'skip_next_turn'
        },
        {
            id: 'motivation',
            name: 'やる気アップ',
            type: 'event',
            calories: 0,
            effect: '次の運動カードの効果2倍',
            rarity: 'uncommon',
            specialEffect: 'exercise_double'
        }
    ],
    
    supplement: [
        {
            id: 'protein',
            name: 'プロテイン',
            type: 'supplement',
            calories: 120,
            nutrients: { protein: 25 },
            effect: '高タンパク補給。筋トレ効果+50%',
            rarity: 'common',
            specialEffect: 'protein_boost'
        },
        {
            id: 'vitamin_c',
            name: 'ビタミンC',
            type: 'supplement',
            calories: 10,
            effect: '免疫力アップ。病気系イベント無効化',
            rarity: 'common',
            specialEffect: 'immunity_boost'
        },
        {
            id: 'bcaa',
            name: 'BCAA',
            type: 'supplement',
            calories: 25,
            effect: '疲労回復。運動後の疲労蓄積を軽減',
            rarity: 'uncommon',
            specialEffect: 'fatigue_recovery'
        },
        {
            id: 'fat_burner',
            name: '脂肪燃焼サプリ',
            type: 'supplement',
            calories: 5,
            effect: '代謝アップ。全てのカロリー消費+20%',
            rarity: 'rare',
            specialEffect: 'calorie_burn_boost'
        },
        {
            id: 'multivitamin',
            name: 'マルチビタミン',
            type: 'supplement',
            calories: 15,
            effect: '栄養バランス改善。体調メーター安定化',
            rarity: 'common',
            specialEffect: 'health_stabilize'
        }
    ]
};

const CARD_POOL = [];
Object.values(CARDS).forEach(category => {
    category.forEach(card => {
        const count = card.rarity === 'common' ? 3 : card.rarity === 'uncommon' ? 2 : 1;
        for (let i = 0; i < count; i++) {
            CARD_POOL.push({...card});
        }
    });
});

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createDeck() {
    return shuffleDeck(CARD_POOL);
}

function drawCards(deck, count) {
    return deck.splice(0, count);
}