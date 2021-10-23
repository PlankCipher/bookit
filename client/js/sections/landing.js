// The typing effect in the landing page
new TypeIt('#typeit', {
  speed: 50,
  deleteSpeed: 50,
  loop: true,
  cursorSpeed: 1000,
  waitUntilVisible: true,
  lifeLike: true,
})
  .type(
    "Save time ... BOOK<span style='color: var(--primary-purple-color)'>IT</span>",
  )
  .pause(1000)
  .delete()
  .type(
    "Choose<span style='color: var(--primary-purple-color)'> category</span>",
  )
  .pause(1000)
  .delete(9)
  .type("<span style='color: var(--primary-purple-color)'> place</span>")
  .pause(1000)
  .delete(6)
  .type("<span style='color: var(--primary-purple-color)'> style</span>")
  .pause(1000)
  .delete()
  .type("<span style='color: var(--primary-purple-color)'>Enjoy</span>")
  .pause(1000)
  .delete()
  .go();

document.querySelector('#arrow').addEventListener('click', () => {
  document.querySelector('#most-booked').scrollIntoView({
    behavior: 'smooth',
  });
});
