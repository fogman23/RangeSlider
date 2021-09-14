declare interface View {
  
}

declare namespace View {
  interface Observer {
    update: (value: number) => {}
  }
}