interface Subsection {
  name: string;
  content: string;
  subsections: Subsection[];
}

export interface Section {
  name: string;
  content: string;
  subsections: Subsection[];
}
