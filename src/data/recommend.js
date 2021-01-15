export default class Recommendation {

    static getRecommendationByUser(userId){
      return fetch(`https://watch-this.vercel.app/recommend/${userId}`, {method: 'GET'});
    };
    
}