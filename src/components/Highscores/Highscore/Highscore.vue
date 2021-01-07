<template>
  <tr class="highscore">
    <td class="highscore__index">{{ highscoreIndex + 1 }}</td>
    <td class="highscore__name">{{ highscore.userId }}</td>
    <td class="highscore__rating">{{ highscore.movieId }}</td>
    <td class="highscore__rating">{{ highscore.rating === 1 ? "&#128077;" : "&#128078;" }}</td>
    <td class="highscore__date">{{ highscoreDate }}</td>
  </tr>
</template>

<script>
  import AppData from '../../AppData';

  export default {
    name: 'Highscore',
    props: ['highscore', 'highscoreIndex'],
    computed: {
      highscoreDate () {
        let date = new Date(this.highscore.timestamp);
        return date.toLocaleString('de-DE');
      }
    }
  };
</script>
