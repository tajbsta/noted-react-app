interface Vendor {
  name: string;
}

(() => {
  const vendors: Vendor[] = []
  const emails: string[] = ['sfasdf']
  console.log({
    vendors,
    emails
  })
})()
