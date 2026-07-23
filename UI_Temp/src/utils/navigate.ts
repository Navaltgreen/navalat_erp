type NavigateFn = (path: string) => void;

export const navigatorRef: { navigate: NavigateFn } = {
  navigate: (path) => {
    console.warn(
      `navigatorRef.navigate("${path}") called before router was mounted`,
    );
  },
};
