import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CalorieBreakdownArticle() {
  return (
    <div className="flex flex-col gap-6 text-base leading-7 text-foreground [&_h2]:font-heading [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-heading [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-foreground/90 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_li]:text-foreground/90 [&_strong]:font-semibold [&_strong]:text-foreground">
      <p>
        Fitness trackers love to hand you a single &ldquo;calories burned&rdquo;
        number and let you trust it completely. In practice, that number is a
        rough estimate layered on top of several very different processes. A
        more useful approach is to break the day into its component parts and
        treat each one as a working estimate rather than a precise figure.
        Here&rsquo;s a practical model for a day that includes a{" "}
        <strong>60-minute loaded treadmill walk</strong>, along with how to
        think about days that look different.
      </p>

      <h2>The four pieces of daily energy expenditure</h2>
      <p>
        Total daily energy expenditure (TDEE) breaks down into four
        categories. None of them are exact — individual variation is real —
        but a reasonable range for each is more useful than a single false-precision
        number.
      </p>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Reasonable daily estimate</TableHead>
                <TableHead>What&rsquo;s counted here</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium whitespace-normal">BMR / RMR</TableCell>
                <TableCell className="whitespace-normal">~1,800–2,000 kcal</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Basic metabolic functions
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium whitespace-normal">NEAT</TableCell>
                <TableCell className="whitespace-normal">~300–500 kcal</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Normal walking, standing, chores, errands, general movement
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium whitespace-normal">Exercise</TableCell>
                <TableCell className="whitespace-normal">~400–600 kcal</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  A 60-min treadmill walk while carrying a kettlebell
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium whitespace-normal">TEF</TableCell>
                <TableCell className="whitespace-normal">~200–300 kcal</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Digestion and processing of food
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold whitespace-normal">Estimated TDEE</TableCell>
                <TableCell className="font-semibold whitespace-normal">~2,700–3,400 kcal</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Total daily expenditure
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ul className="text-sm text-muted-foreground">
        <li>
          <strong>BMR/RMR</strong> — the energy your body burns at rest just
          to keep you alive: breathing, circulation, cell repair, organ
          function.
        </li>
        <li>
          <strong>NEAT</strong> (non-exercise activity thermogenesis) — every
          bit of movement that isn&rsquo;t a dedicated workout: walking around
          the house, standing at a desk, fidgeting, errands.
        </li>
        <li>
          <strong>Exercise</strong> — dedicated training sessions, like a
          loaded treadmill walk or a lifting session.
        </li>
        <li>
          <strong>TEF</strong> (thermic effect of food) — the energy your body
          spends digesting and processing what you eat.
        </li>
      </ul>

      <h2>A worked example: ~3,050 calories</h2>
      <p>
        A reasonable middle-of-the-road example for an active day with a
        60-minute loaded treadmill walk works out to about{" "}
        <strong>3,050 calories</strong>:
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            1,900 resting + 425 lifestyle movement + 475 exercise + 250
            digestion
          </CardTitle>
          <CardDescription>= ~3,050 calories burned</CardDescription>
        </CardHeader>
      </Card>

      <h2>Exercise calories are incremental, not additive</h2>
      <p>
        The most important point in this whole model: exercise calories
        should be counted as <strong>incremental</strong>, not as a full
        bonus on top of everything else. If a treadmill session burns 475
        calories total, some of those calories would have been burned during
        that hour anyway, even sitting around. Automatically adding whatever
        a treadmill or watch reports on top of an estimated TDEE tends to
        overstate the deficit. For fat-loss math, it&rsquo;s safer to lean
        slightly conservative on exercise estimates.
      </p>

      <h2>How different days compare</h2>
      <p>
        Using the same model, here&rsquo;s roughly how total daily burn shifts
        across different kinds of days:
      </p>
      <ul>
        <li>
          <strong>Rest / sedentary day:</strong> roughly 2,450–2,750 calories
        </li>
        <li>
          <strong>Normal active day:</strong> roughly 2,650–2,950 calories
        </li>
        <li>
          <strong>60-min loaded treadmill day:</strong> roughly 2,850–3,250
          calories
        </li>
        <li>
          <strong>Loaded walk + weight-training day:</strong> potentially
          3,050–3,450+ calories
        </li>
      </ul>

      <h2>A simpler way to track it day to day</h2>
      <p>
        Rather than recalculating NEAT from scratch every day, it works
        better to establish a baseline NEAT level and adjust it mostly from
        steps and general activity. Exercise is much easier to track
        separately since it&rsquo;s a discrete, loggable session.
      </p>
      <p>
        A useful daily scorecard pulls all of this into one line:
      </p>
      <p className="rounded-lg border bg-muted/40 px-4 py-3 font-medium">
        BMR&nbsp;·&nbsp;NEAT&nbsp;·&nbsp;Exercise&nbsp;·&nbsp;TEF&nbsp;·&nbsp;Estimated
        TDEE&nbsp;·&nbsp;Calories eaten&nbsp;·&nbsp;Estimated deficit/surplus
      </p>
      <p>
        Tracking each day this way gives a much better picture of weekly
        energy balance than looking at workout calories alone.
      </p>

      <p className="text-sm text-muted-foreground">
        Illustrative estimates for an active day with a 60-minute loaded
        treadmill walk. Individual energy expenditure can vary substantially
        based on body composition, fitness level, and other factors — use
        these as a working model, not a precise measurement.
      </p>
    </div>
  );
}
