import '../styles/app.less';
import dataNumbers from '../data/data.json';

//=============== LOCAL JSON FILE
let numbersArray = []

dataNumbers.data.forEach((obj, i) => {
   numbersArray.push(obj)
});

let object = Object.assign({}, numbersArray);

let seperateObject = object => {
    let objArray = [];
    let keys = Object.keys(object);
    keys.forEach(key => {
        objArray.push({
            number: object[key]
        });
    });
    return objArray;
};

let data = seperateObject(object);


const url = "https://raw.githubusercontent.com/terakeet/candidate-assignment-software-frontend/main/src/data/data.json";

let app = new Vue({
    el: '#app',
    data:{
        cards: data,
        openedCards: [],
        cardDeck: [],
        attempts: 0,
    },
    // mounted () {
    //     axios.get(url).then(response => {
    //         info = response.data.data;
    //         let object2 = Object.assign({}, info);
    //         let finalData = seperateObject(object2);
    //         this.cards = finalData;
    //         console.log(this.cards)
    //     })
    // },
    created(){
        this.cards.forEach((card) => {
            Vue.set(card,'isFlipped',false);
            Vue.set(card,'isMatched',false);
        });
     

        this.cardDeck = _.shuffle(this.cardDeck.concat(_.cloneDeep(this.cards), _.cloneDeep(this.cards)));
    },

    methods:{

        flipCard(card){

            if(card.isMatched || card.isFlipped || this.openedCards.length === 2)
                return;
        
            card.isFlipped = true;
        
            if(this.openedCards.length < 2)
                this.openedCards.push(card);

            if(this.openedCards.length === 2)    
                this._match(card);
        },
        
        _match(card){
            if(this.openedCards[0].number === this.openedCards[1].number){
                setTimeout(() => {
                    this.openedCards.forEach(card => card.isMatched = true);
                    this.openedCards = [];
                    if(this.cardDeck.every(card => card.isMatched === true)){
                        this.finish = true;
                    }
                }, 400);
            }
            else{
                setTimeout(() => {
                    this.openedCards.forEach((card) => {card.isFlipped = false});
                    this.openedCards = [];
                }, 800);
            }
            this.attempts++;
        },
        reset(){
            clearInterval(this.interval);
        
            this.cards.forEach((card) => {
                Vue.set(card, 'isFlipped',false);
                Vue.set(card, 'isMatched',false);
            });

            setTimeout(() => {  
                this.cardDeck = [];
                this.cardDeck = _.shuffle(this.cardDeck.concat(_.cloneDeep(this.cards), _.cloneDeep(this.cards)));
                this.start = false;
                this.finish = false;
                this.attempts = 0;
                this.openedCards = [];  
            }, 400);
        },
    }
});

