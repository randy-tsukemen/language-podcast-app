import TTSContainer from './components/TTSContainer';

const PODCAST_CONTENT = `Hello, dear listeners! Welcome back to our podcast. Today, we're diving into a cherished aspect of Japanese culture: the cherry blossom season, known as "sakura."

Cultural Significance of Sakura

In Japan, cherry blossoms are more than just beautiful flowers; they symbolize the fleeting nature of life. Their brief bloom, lasting only about two weeks, reminds us of life's transience and the importance of cherishing each moment. This concept is deeply rooted in Japanese philosophy and is often referred to as "mono no aware," the poignant awareness of impermanence.

Hanami: The Tradition of Flower Viewing

Each spring, as sakura trees burst into bloom, people across Japan partake in "hanami," which means "flower viewing." This tradition involves gathering under cherry blossom trees with family and friends to appreciate the blossoms' beauty, share food and drinks, and celebrate the arrival of spring. It's a time of joy, reflection, and community bonding.

Common Expressions Related to Sakura

Cherry Blossom: The most common term for sakura in English is "cherry blossom." For example, "The cherry blossoms have come early this year."
English Cool

Cherry Blossom Season: This refers to the period when the cherry blossoms are in full bloom. For instance, "Many tourists visit Japan during the cherry blossom season."

Hanami: Directly translating to "flower viewing," hanami is the traditional activity of enjoying the beauty of flowers, especially cherry blossoms. You might say, "We had a delightful hanami picnic under the sakura trees."

Experiencing Sakura Season

If you have the opportunity to visit Japan during sakura season, it's a truly magical experience. Parks and streets are adorned with delicate pink blossoms, and there's a festive atmosphere everywhere. Participating in hanami allows you to immerse yourself in a tradition that has been cherished for centuries.

Thank you for joining us today. We hope this glimpse into Japan's cherry blossom season has enriched your understanding of its cultural significance and the beauty it brings each year.

Until next time, take care and keep exploring the wonders of the world!`;

export default function Home() {
  return (
    <TTSContainer 
      title="Japanese Culture: Cherry Blossoms"
      initialText={PODCAST_CONTENT}
    />
  );
}
