

const ASTRAL_RANGE = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g

export default class SafeString {
  private _match: string[] = []
  constructor(
    private readonly _string: string
  ) {
    this._match = _string.match(ASTRAL_RANGE) || []
  }

  get value() {
    return this._string
  }

  get length() {
    return this._match.length
  }

  getChars() {
    return [...this._match]
  }

  /**
   * Reverse the string in place
   * @return {[String]} [The reversed string]
   */
  reverse() {
    return this._match.reverse().join('')
  }

  /**
   * The substring() method returns a subset of a string between begin index and end index
   * @param  {Number} begin [begin index]
   * @param  {Number} end   [end index]
   * @return {[String]}     [A new string containing the extracted section of the given string.]
   */
  substring(indexStart = 0, indexEnd = this.length) {
    return this._match.slice(indexStart, indexEnd).join('')
  }
}
