import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.net.URI;

public class CheckFile {
    public static void main(String[] args) {
        Path p = Paths.get("uploads/profiles/1776687332630_PIC.jpeg");
        System.out.println("Exists: " + Files.exists(p));
        System.out.println("Absolute: " + p.toAbsolutePath().toString());
        System.out.println("URI: " + p.toUri().toString());
        
        Path dir = Paths.get("uploads/");
        System.out.println("Dir URI: " + dir.toUri().toString());
        System.out.println("Dir Absolute: " + dir.toAbsolutePath().toString());
    }
}
