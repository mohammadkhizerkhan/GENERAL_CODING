package inheritence;

public class ParentClass {
    int l;
    int b;

    public ParentClass(int l, int b) {
        this.l = l;
        this.b = b;
    }

    public ParentClass(ParentClass mainObj) {
        this.l =mainObj.l;
        this.b =mainObj.b;
    }

    public int area(){
        return l*b;
    }

    public int perimeter(){
        return 2 * (l+b);
    }
}
