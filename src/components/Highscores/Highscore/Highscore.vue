<template>
  <tr class="highscore">
    <td class="highscore__userId">{{ highscore.userId }}</td>
    <td class="highscore__movieName">{{ highscore.movieName }}</td>
    <td class="highscore__rating">{{ highscore.rating === 1 ? "&#128077;" : "&#128078;" }}</td>
  </tr>
</template>

<script>
  import AppData from '../../AppData';

  export default {
    name: 'Highscore',
    props: ['highscore'],
  };
</script>
