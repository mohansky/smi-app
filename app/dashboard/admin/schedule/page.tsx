// "use client";

import { Container } from "@/components/custom-ui/container";

export default function Scheduler() {
  return (
    <Container width="marginxy">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Weekly Scheduler
        </h1>
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR6QnoXYht7HsfkrLzNKfZkvELvcZjDAvpcKtEjEsfp0Exda94a_cAfBBbQN0LV2WEJdiHfzcXCg13q/pubhtml?widget=true&amp;headers=false"
          height="600"
          width="800"
        ></iframe>
      </div>
    </Container>
  );
}
