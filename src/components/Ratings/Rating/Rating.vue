<template>
  <tr class="rating">
    <td class="rating__userId">{{ rating.userId }}</td>
    <td class="rating__movieName">{{ rating.movieName }}</td>
    <td class="rating__rating">{{ rating.rating === 1 ? "&#128077;" : "&#128078;" }}</td>
  </tr>
</template>

<script>
  export default {
    name: 'Rating',
    props: ['rating'],
  };
</script>
