const mealPackage = {
    fakedb : [],
    topdb: [],
    dbInit(){
        this.fakedb.push({
            title: "tomato pasta",
            foodcategory: "noodle",
            synopsis: "sphagetti, tomato sauce, garlic, pork, cheese",
            price: "$14.5",
            toppackge: true,
            imagePath: "pasta.jpg"
        });

        this.fakedb.push({
            title: "miso ramen",
            foodcategory: "noodle",
            price: "$13.25",
            synopsis: "ramen, pork broth, miso, sea weed, chasu",
            toppackge: false,
            imagePath: "ramen.jpg"
        });

        this.fakedb.push({
            title: "kimchi sitred fried rice",
            foodcategory: "rice",
            synopsis: "rice, pork, kimchi, egg",
            price: "$10.5",
            toppackge: false,
            imagePath: "krice.jpg"
        });

        this.fakedb.push({
            title: "poke package",
            foodcategory: "rice",
            synopsis: "rice, salmon, cabage, cucumber, sea weed",
            price: "$14",
            toppackge: false,
            imagePath: "poke.jpg"
        });
        this.fakedb.push({
            title: "chiken Teriyaki",
            foodcategory: "rice",
            synopsis: "rice, chiken, cabage, egg, teriyaki sauce",
            price: "$12.5",
            toppackge: true,
            imagePath: "chiken.jpg"
        });
        this.fakedb.push({
            title: "butter chiken",
            foodcategory: "chiken",
            synopsis: "chiken, brocoli, pepper, curry sauce",
            price: "$13.99",
            toppackge: true,
            imagePath: "butter.webp"
        });
        this.fakedb.push({
            title: "aglio olio",
            foodcategory: "pasta",
            synopsis: "pasta, garlic, peperoncino, olive oil",
            price: "$11.95",
            toppackge: false,
            imagePath: "alio.jpeg"
        });
        this.fakedb.push({
            title: "pho",
            foodcategory: "rice",
            synopsis: "rice noodle, porkborth, cilantro, pork",
            price: "$10.25",
            toppackge: true,
            imagePath: "pho.jpg"
        });
    },
    getAllmeals(){
        return this.fakedb;
    },
    getTopPackage(){
        this.topdb.splice(0, this.topdb.length);
        for(i = 0; i < this.fakedb.length; i++){
            if(this.fakedb[i].toppackge == true){
                this.topdb.push(this.fakedb[i]);
            }
        }
        return this.topdb;
    }
}

mealPackage.dbInit();
module.exports = mealPackage;