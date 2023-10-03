<script lang="ts">
  export let startTime: number
  export let endTime: number
  export let closed: boolean

  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0
  let timeleft = 0
  let now = new Date().getTime()

  const countDown = function (toTime: number) {
    now = new Date().getTime()
    timeleft = endTime - now

    days = Math.floor(timeleft / (1000 * 60 * 60 * 24))
    hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
    seconds = Math.floor((timeleft % (1000 * 60)) / 1000)
  }

  let isActive = startTime <= now && endTime > now && !closed
  let isUpcomming = startTime > now
  if (isUpcomming) setInterval(() => countDown(startTime), 1000)

  if (isActive) setInterval(() => countDown(endTime), 1000)
</script>

{#if isUpcomming}
  <div>
    Upcoming {days}d : {hours}h : {minutes}m : {seconds}s
  </div>
{:else if isActive}
  <div>
    Live {days}d : {hours}h : {minutes}m : {seconds}s
  </div>
{:else}
  <div>Ended</div>
{/if}
