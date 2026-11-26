/**
 * “Berry’s Lantern”: a 24-chapter advent story. Berry the Robin collects one
 * spark of Christmas magic a day so the child can light the Christmas Star on
 * Christmas Eve, meeting the squishy-kit characters on the way. `{name}` is
 * replaced with the child’s first name.
 */
export type AdventDay = {
  day: number;
  title: string;
  poem: [string, string, string, string];
  story: string;
  /** A small real-world kindness or activity for the child. */
  spark: string;
};

export const ADVENT_DAYS: AdventDay[] = [
  {
    day: 1,
    title: "The Empty Lantern",
    poem: ["The first snow falls on Pinewood Hill,", "The village lanes are hushed and still.", "A lantern waits, its glass all dark —", "Today it needs its very first spark."],
    story: "High on Pinewood Hill, the great Christmas Star at the top of the tallest pine tree had gone dark. Then a parcel tied with red ribbon dropped out of the sky. Inside was an empty glass lantern and a note from the North Pole: “Collect one spark of Christmas magic every day. On Christmas Eve, take the lantern to {name}. {name} will light the Star.” A little robin called Berry puffed out his feathers. “I’ll do it!” he chirped. And as he spoke, the very first spark flickered inside the glass.",
    spark: "Be brave and try something new today, however small.",
  },
  {
    day: 2,
    title: "Wobbly Wings",
    poem: ["The lantern’s big, the robin small,", "He wobbles, tumbles, starts to fall.", "But up he hops and tries once more —", "That’s what a brave heart’s wings are for."],
    story: "The lantern was almost as big as Berry. On his first try he flapped, wobbled and landed — plop! — in a snowdrift. On his second try he got as far as the woodpile. On his third try he flew all the way round the village green, puffing and proud. The second spark glowed beside the first. “Sparks don’t come from getting it right first time,” Berry decided. “They come from trying again.”",
    spark: "If something feels tricky, take a breath and have another go.",
  },
  {
    day: 3,
    title: "Cocoa at the Old Mill",
    poem: ["Cold toes, cold beak, cold feathered chest,", "The mill mice called, “Come in and rest!”", "A cup of cocoa, warm and sweet,", "With three marshmallows for a treat."],
    story: "By the afternoon, Berry’s feathers were frosty. The mill mice spotted him shivering on the water wheel and waved him inside. They warmed a thimble of cocoa and dropped in three marshmallows, each the size of a snowflake. “We haven’t got much,” said the smallest mouse, “but we always share.” Berry felt warm right down to his toes, and the third spark came from the mice’s kindness, glowing pink and gold.",
    spark: "Share something with someone today.",
  },
  {
    day: 4,
    title: "A Letter for {name}",
    poem: ["Berry dipped his claw in ink", "And stopped a while to sit and think.", "“Dear {name},” he wrote, “just wait and see —", "There’s something magic on its way from me!”"],
    story: "Berry decided {name} should know the lantern was coming. He found a smooth piece of birch bark and wrote in his very best handwriting: “Dear {name}, something magical is coming on Christmas Eve. Love from Berry.” He popped it into the woodland postbox, a hollow in an old oak tree. A squirrel postman tipped his hat. “Letters full of kind words make the brightest sparks,” he said. He was right: the fourth spark shone like a candle.",
    spark: "Write or draw a little note for someone you love.",
  },
  {
    day: 5,
    title: "Rudy’s First Flight",
    poem: ["Young Rudy tried to fly — and sank,", "Head first into a snowy bank.", "“Just one more go,” said Berry. “Try!”", "And Rudy soared into the sky."],
    story: "At the edge of the forest, Berry met a young reindeer with a shiny red nose and droopy ears. “I’m Rudy,” he sniffed. “All my cousins can fly, but I can’t.” Berry knew all about wobbly first flights. “Take a big run-up,” he said, “and think of something happy.” Rudy thought of hot carrot soup. He ran, he leapt… and for three whole seconds he was flying! Rudy whooped so loudly that the fifth spark burst into the lantern. “Can I come with you?” he asked. Of course he could.",
    spark: "Cheer someone on today, like Berry cheered on Rudy.",
  },
  {
    day: 6,
    title: "No Two Snowflakes",
    poem: ["Each snowflake twirls its own sweet way,", "No two are ever twins, they say.", "And just like them, it’s plain to see", "There’s only one {name} — as it should be!"],
    story: "Snow fell all morning, and Berry and Rudy tried to catch two snowflakes that matched. They caught a star-shaped one, a feathery one, and one that looked like a tiny wheel, but no two were ever the same. “Just like children,” said Rudy. “There’s nobody else in the whole world quite like {name}.” The sixth spark settled into the lantern with a soft, silvery twinkle.",
    spark: "Tell someone one thing that makes them special.",
  },
  {
    day: 7,
    title: "Fern Finds the Way",
    poem: ["The fog rolled in, so thick and grey,", "Our friends could hardly see the way.", "Then two bright eyes, one fluffy tail —", "Fern the Fox knew every trail!"],
    story: "A thick white fog rolled through the forest. Berry couldn’t see the end of his own wings, and Rudy bumped into three trees. Then a voice called, “Follow my tail!” A fox with a bright orange coat trotted out of the mist. “I’m Fern. I know every path in these woods.” She led them safely to a cosy clearing. “Thank you,” said Berry. “Helping is what friends do,” said Fern, and the seventh spark lit up like a little sunrise. Fern joined the team.",
    spark: "Help someone today without being asked.",
  },
  {
    day: 8,
    title: "Ginger’s Bakery",
    poem: ["A smell of cinnamon and spice,", "Of gingerbread and all things nice!", "Ginger baked a batch of stars", "And packed them up in biscuit jars."],
    story: "Fern followed her nose to a tiny bakery with a crooked chimney. Inside, a gingerbread friend with three icing buttons was rolling out dough. “I’m Ginger!” she said. “I’ve baked star biscuits for your journey.” She had made exactly enough for everyone, plus one extra “in case someone new turns up”. Sharing with friends you haven’t even met yet is a very special magic, so the eighth spark arrived smelling faintly of cinnamon.",
    spark: "Make or share a treat with someone.",
  },
  {
    day: 9,
    title: "Toboggan Hill",
    poem: ["Up the hill, then — WHOOSH! — back down,", "The fastest sledge in all the town!", "They laughed so hard they rolled in snow", "And made the lantern’s sparks all glow."],
    story: "The path went over Toboggan Hill, and the squirrels lent the friends a wooden sledge. Berry sat at the front, Rudy at the back, and Fern and Ginger squeezed in the middle. WHOOSH! They zoomed down so fast that Ginger’s icing buttons nearly flew off. They tumbled into a snowdrift at the bottom, giggling until their tummies hurt. Laughter is one of the strongest kinds of Christmas magic, so the ninth spark fizzed and popped like a firework.",
    spark: "Make someone laugh today.",
  },
  {
    day: 10,
    title: "The Little Sapling",
    poem: ["A tiny tree, so thin and small,", "Stood shivering where the snowflakes fall.", "They built a wall of snow to keep", "It safe and snug while fast asleep."],
    story: "Beside the path stood a tiny pine sapling, shivering in the wind. “It will be a great big tree one day,” said Fern, “if it can just get through the winter.” So the friends packed snow into a cosy wall to shelter it. Did you know a real tree has been planted for {name} too? It’s growing far away right now, giving birds and little creatures a home. The tenth spark glowed a gentle, leafy green.",
    spark: "Do something kind for nature, like feeding the birds.",
  },
  {
    day: 11,
    title: "Professor Owl’s Star Map",
    poem: ["Professor Owl, so wise and old,", "Unrolled a map of blue and gold.", "“When nights are long and skies are dark,", "Just follow the North Star’s spark.”"],
    story: "That night, the friends weren’t sure which way to go. Then they heard a hoot from a hollow tree. Professor Owl peered at them over her tiny spectacles and unrolled a map covered in stars. “To find {name}’s home,” she said, “follow the brightest star in the north. It never moves, so you’ll never get lost.” Learning something new always makes a spark, so the eleventh one twinkled just like the stars on the map.",
    spark: "Find out something new. Can you spot the brightest star tonight?",
  },
  {
    day: 12,
    title: "The Halfway Bells",
    poem: ["Ding-dong! The silver sleigh bells ring,", "The woodland creatures start to sing.", "The lantern’s halfway full tonight —", "Twelve sparks of glowing, golden light!"],
    story: "When the friends held up the lantern, eleven sparks swirled round and round inside. “Only one more and we’re halfway,” said Ginger, hopping from foot to foot. “When will it come?” They waited, and waited, and waited some more. Then, across the valley, the silver bells of Pinewood began to ring, and the twelfth spark floated gently down. Being patient is hard, but it’s a magic all of its own. Halfway to Christmas Eve!",
    spark: "Wait patiently for your turn today.",
  },
  {
    day: 13,
    title: "Flurry Says Hello",
    poem: ["Two coal eyes and a carrot nose,", "A stripy scarf in teal-green rows,", "A top hat perched upon his head —", "“Hello there!” the jolly snowman said."],
    story: "The friends stopped in a snowy meadow to build a snowman. Ginger gave him two coal eyes, Rudy found a carrot for his nose, Fern wrapped him in a stripy scarf, and Berry placed a top hat on his head. Then the lantern glowed, the snowman blinked and said, “Ooh, what a lovely hat!” His name was Flurry, and he wanted to come too. Imagination is a powerful thing: it made the thirteenth spark, and a brand-new friend.",
    spark: "Build, draw or imagine a brand-new friend.",
  },
  {
    day: 14,
    title: "The Rainbow Train",
    poem: ["Red and yellow, green and blue,", "The elves had painting jobs to do.", "A wobble, splosh — oh no, a spill!", "But rainbow trains are lovely still."],
    story: "At the edge of the forest stood the elves’ toy workshop. The elves were very busy, so the friends offered to help paint the wooden trains. Flurry dabbed on red, Fern swished on some blue, and then — SPLOSH! — Rudy knocked over every pot at once. The train came out rainbow-striped. Everyone held their breath… but the chief elf clapped. “It’s the most wonderful train we’ve ever made!” Being creative, even when it gets messy, made the fourteenth spark shine in every colour.",
    spark: "Make something colourful. It’s fine if it gets messy!",
  },
  {
    day: 15,
    title: "Hazel’s Quilt",
    poem: ["Tiptoe, tiptoe, not a peep,", "Hazel Hedgehog’s fast asleep.", "They tucked her quilt up to her nose", "And crept away on tippy-toes."],
    story: "Under a pile of crunchy leaves, the friends found Hazel the Hedgehog, snoring softly. Hedgehogs sleep right through the winter, and her quilt had slipped off. Very gently, Fern tucked it back round her. “Shh,” whispered Berry, and everyone tiptoed away — even Rudy, who isn’t very good at tiptoeing. Nobody would ever know they’d helped, but quiet kindness counts just as much, and the fifteenth spark glowed soft and warm.",
    spark: "Do a kind thing that nobody sees.",
  },
  {
    day: 16,
    title: "The Dancing Sky",
    poem: ["Ribbons of green and purple light", "Went swirling through the sky tonight.", "The friends lay back upon the snow", "And watched the shimmering colours glow."],
    story: "That night the sky came alive. Ribbons of green, pink and purple light swirled and rippled above the trees. “The Northern Lights!” breathed Professor Owl, who had flown along to see. The friends lay back in the snow and simply watched, not saying anything at all. Sometimes the most magical thing you can do is stop and notice how beautiful the world is. The sixteenth spark shimmered green and purple, just like the sky.",
    spark: "Stop and notice something beautiful today.",
  },
  {
    day: 17,
    title: "North Pole Post",
    poem: ["A postbag tumbled from the sky,", "Stamped “North Pole Post — Express — Fly High!”", "Inside, a note in Santa’s hand:", "“Keep going, friends! You’re doing grand!”"],
    story: "THUMP! A big red postbag landed in the snow, stamped with a gold seal. Inside was a letter from Santa himself. “Dear Berry and friends, I’ve been watching your journey and I’m very proud. The Star is counting on you. P.S. I’ve checked my list twice, and {name} is on it!” Everyone cheered so loudly that snow slid off the trees. Hope is a wonderful kind of magic, and the seventeenth spark leapt into the lantern.",
    spark: "Tell someone what you’re most looking forward to this Christmas.",
  },
  {
    day: 18,
    title: "Candy Cane Lane",
    poem: ["Red and white and twisty-sweet,", "The lampposts lined the snowy street.", "They counted every stripe they saw,", "Then counted all of them once more!"],
    story: "The path became a lane lined with lampposts shaped like candy canes. “Let’s count the stripes!” said Ginger. They got to forty-two, then Flurry sneezed, and everyone lost count and had to start again. They counted, giggled, sang a counting song and invented a new game called Stripe Spotters. Playing together is one of the best kinds of magic, and the eighteenth spark came out stripy, red and white.",
    spark: "Play a game with someone today.",
  },
  {
    day: 19,
    title: "Pip’s Long Walk",
    poem: ["From frozen shores so far away,", "Pip waddled north by night and day.", "“I heard you needed one more friend,", "So here I am, right to the end!”"],
    story: "A small penguin in a green bobble hat came waddling over the hill, puffing and panting. “I’m Pip,” he said. “I heard all about your journey and walked all the way from the far, frozen south to help.” Penguins can’t fly, so it had taken him ages. “You came all this way for us?” asked Berry. “That’s what friends are for,” said Pip. The nineteenth spark glowed brighter than any spark before.",
    spark: "Spend some special time with a friend or someone in your family.",
  },
  {
    day: 20,
    title: "A Present for {name}",
    poem: ["They wrapped a gift in paper bright", "And tied the ribbon, nice and tight.", "A present made with love and care,", "For {name}, from the woodland there."],
    story: "“We should make a present for {name},” said Ginger, and everyone agreed. They gathered the shiniest holly berries, the biggest pine cone and a ribbon as red as Berry’s chest, and made something to remind {name} of the woodland. Pip did the wrapping, which took quite a while with flippers. Flurry tied the bow. Giving feels even better than getting, and the twentieth spark sparkled like wrapping paper.",
    spark: "Make or wrap a little present for someone.",
  },
  {
    day: 21,
    title: "The Longest Night",
    poem: ["Tonight’s the longest night of all,", "When shadows stretch and cold winds call.", "But little lights, though small, are bright", "And chase away the darkest night."],
    story: "It was the winter solstice, the longest night of the whole year. The forest was very dark, and Pip held Berry’s wing a little tighter. Then Berry lifted the lantern, and its twenty sparks lit up the path like a little sun. “See?” said Fern. “Even a small light makes a big difference.” From tomorrow, the days would start getting longer again. The twenty-first spark was the brightest yet.",
    spark: "Light up someone’s day with a big smile.",
  },
  {
    day: 22,
    title: "Carrots for the Reindeer",
    poem: ["For Santa’s reindeer, swift and fleet,", "Nine crunchy carrots for a treat.", "Rudy packed them, one by one,", "For hungry hooves when work is done."],
    story: "“Santa’s reindeer will be hungry after flying round the whole world,” said Rudy, thinking of his cousins. So the friends pulled up nine crunchy carrots from the village vegetable patch (they asked first) and packed them into a little crate with a label: For the reindeer, with love. Thinking about what others need is a special kind of kindness, and the twenty-second spark glowed carrot-orange.",
    spark: "Think about what someone else needs, and help them.",
  },
  {
    day: 23,
    title: "One Spark to Go",
    poem: ["The sleigh flew by, all red and gold,", "Its runners gleaming in the cold.", "The lantern’s nearly full — but wait!", "One spark to go… it can’t be late!"],
    story: "From the top of the very last hill, the friends could see {name}’s home twinkling below. Just then a sleigh swooped overhead on a practice flight, its runners polished until they gleamed. Santa waved: “See you tomorrow night!” Berry counted the sparks: twenty-three. “One is missing!” he gasped. Professor Owl smiled. “The last spark can’t be collected by us,” she said. “It has to come from {name}. You’ll see.”",
    spark: "Help get your home ready for Christmas.",
  },
  {
    day: 24,
    title: "The Christmas Star",
    poem: ["On Christmas Eve, the friends all came", "And softly whispered {name}’s name.", "The final spark — it came from you,", "And lit the Star the whole night through."],
    story: "On Christmas Eve, Berry, Rudy, Fern, Ginger, Flurry and Pip crept up to {name}’s window with the lantern. “The last spark,” whispered Berry, “is all the kindness {name} has shared this Christmas.” And as {name} opened this door, the twenty-fourth spark flew into the lantern. WHOOSH! A beam of golden light shot all the way up to the Christmas Star, which blazed so brightly it lit up the whole sky. Far away, Santa looked up and smiled. “Now I can find every home,” he said. Sleep tight, {name}, and listen carefully for sleigh bells…",
    spark: "You did it! Leave a carrot out for the reindeer tonight.",
  },
];

export const personaliseAdvent = (text: string, name: string) => text.replaceAll("{name}", name);
