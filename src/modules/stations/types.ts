export type UTMCoordinates = {
  crs: string;
  zone: string;
  east?: number;
  west?: number;
  north?: number;
  south?: number;
};

export type QuizOption = {
  label: string;
  answer: string | boolean;
};

export type CIHTML = {
  content_type: "html";
  title: string;
  content_before_fold: string;
  content_after_fold: string;
};

export type CIGallery = {
  content_type: "gallery";
  title: "string";
  description: "string";
  items: ({
    asset: string;
    caption: string;
  })[];
};

export type CIQuiz = {
  content_type: "quiz";
  quiz_type: "match_values" | "select_all_that_apply" | "choose_one";
  title: string;
  question: string;
  answer: string;
  options: QuizOption[];
};

export type StationContentItem = CIHTML | CIGallery | CIQuiz;

type StationBase = {
  id: string;
  title: string;
  long_title: string;
  subtitle: string;
  coordinates_utm: UTMCoordinates;
  visible: {
    from: string;
    to: string;
  };
  section: string;
  category: string;
  header_image: string;
  contents: StationContentItem[];
  enabled: boolean;
  rank: number;
};

export type Station = StationBase & {
  revision: {
    timestamp: string;
    number: number;
    message: string;
  };
};

export type StationUpdate = Station | {
  enabled: boolean;
  revision: {
    working_copy: number;
  };
};
