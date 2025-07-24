# **App Name**: Vuelo Facilito

## Core Features:

- Origin Selection: Allow the user to select their origin from a dropdown.
- Destination Selection: Allow the user to select their destination from a dropdown. The typical destinations are La Paz, Mexico City (CDMX), and Tijuana.
- Date Selection and Highlighting: Calendar selector with highlighting for daytime flights, based on returned flight data.
- AI Flight Summarization and Sorting: Use generative AI tool to summarize available daytime flights and sort based on lowest price. AI will only show routes that do not fall within the specified timeframe, ensuring flights are not at night. This will call the flight search API in the background, reason about and choose the best available daytime flights, and then render the data in an easily digestible format for your Mom.
- Flight Option Display: Clear display of flight options, showing departure time, arrival time, and price. Order the list by the least expensive flights first.

## Style Guidelines:

- Primary color: Soft sky blue (#87CEEB) to evoke feelings of air travel and tranquility.
- Background color: Very light desaturated blue (#F0F8FF) to provide a clean and calming backdrop.
- Accent color: Warm orange (#FF7F50) for highlighting the best flight deals.
- Headline font: 'Poppins', a geometric sans-serif, to give the app a modern, friendly feel.
- Body font: 'PT Sans', a humanist sans-serif, to ensure readability and a touch of warmth.
- Use simple, intuitive icons for airports and flight information.
- Subtle animations when new flight options are loaded.